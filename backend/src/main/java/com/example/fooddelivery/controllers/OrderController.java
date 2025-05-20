package com.example.fooddelivery.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.el.stream.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fooddelivery.models.Customer;
import com.example.fooddelivery.models.DeliveryPerson;
import com.example.fooddelivery.models.MenuItem;
import com.example.fooddelivery.models.Order;
import com.example.fooddelivery.models.OrderItem;
import com.example.fooddelivery.models.Restaurant;
import com.example.fooddelivery.repository.CustomerRepository;
import com.example.fooddelivery.repository.DeliveryPersonRepository;
import com.example.fooddelivery.repository.MenuItemRepository;
import com.example.fooddelivery.repository.OrderRepository;
import com.example.fooddelivery.repository.RestaurantRepository;
import com.example.fooddelivery.services.PriceCalculationService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private PriceCalculationService priceCalculationService;

    @Autowired
    private DeliveryPersonRepository deliveryRepository;

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    
    
    @PostMapping("/makeOrder")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            logger.info("Received order creation request: {}", payload);

            Long customerId = Long.valueOf(payload.get("customerId").toString());
            Long restaurantId = Long.valueOf(payload.get("restaurantId").toString());
            String address = (String) payload.get("address");
            double totalPrice = Double.parseDouble(payload.get("totalPrice").toString());

            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid customer ID: " + customerId));
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid restaurant ID: " + restaurantId));

            List<Map<String, Object>> itemsRaw = (List<Map<String, Object>>) payload.get("items");
            if (itemsRaw == null || itemsRaw.isEmpty()) {
                return ResponseEntity.badRequest().body("Order items list is empty or missing");
            }

            Order order = new Order();
            order.setCustomer(customer);
            order.setRestaurant(restaurant);
            order.setTotalPrice(totalPrice);
            order.setStatus("pending");
            order.setDeliveryPerson(null);
            order.setAddress(address);

            List<OrderItem> orderItems = new ArrayList<>();
            for (Map<String, Object> entry : itemsRaw) {
                Long itemId = Long.valueOf(entry.get("id").toString());
                int quantity = Integer.parseInt(entry.get("quantity").toString());

                MenuItem menuItem = menuItemRepository.findById(itemId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid menu item ID: " + itemId));

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setMenuItem(menuItem);
                orderItem.setQuantity(quantity);

                orderItems.add(orderItem);
            }

            order.setOrderItems(orderItems);
            orderRepository.save(order);

            logger.info("Order successfully created: orderId = {}", order.getId());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.error("Failed to create order", e);
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
    }



    @PostMapping("/byCustomer")
    public ResponseEntity<?> getOrdersByCustomer(@RequestBody Map<String, Object> payload) {
        try {
            Long customerId = Long.valueOf(payload.get("customerId").toString());
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid customer ID"));

            List<Order> orders = orderRepository.findByCustomer(customer);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
    }

    @PostMapping("/byRestaurant")
    public ResponseEntity<?> getOrdersByRestaurant(@RequestBody Map<String, Object> payload) {
        try {
            Long restaurantId = Long.valueOf(payload.get("restaurantId").toString());
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid restaurant ID"));

            List<Order> orders = orderRepository.findByRestaurantWithItems(restaurant);

    
            for (Order order : orders) {
                System.out.println("Order ID: " + order.getId());
                if (order.getOrderItems() != null) {
                    for (OrderItem item : order.getOrderItems()) {
                        System.out.println("  Item ID: " + item.getId() + ", MenuItem ID: " + item.getMenuItem().getId() + ", Quantity: " + item.getQuantity());
                    }
                }
            }

            List<OrderItem> allItems = orders.stream()
                .flatMap(o -> o.getOrderItems().stream())
                .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("orders", orders);
            response.put("items", allItems);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
    }

    @PostMapping("/availableForDelivery")
    public ResponseEntity<?> getAvailableOrdersForDelivery() {
        try {
            List<Order> availableOrders = orderRepository.findByDeliveryPersonIsNullAndStatusIn(List.of("preparing", "readyForPickup"));
            return ResponseEntity.ok(availableOrders);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch available orders: " + e.getMessage());
        }
    }

   @PostMapping("/currentDelivery")
    public ResponseEntity<?> getCurrentDeliveriesForCourier(@RequestBody Map<String, Object> payload) {
        try {
            Long deliveryPersonId = Long.valueOf(payload.get("deliveryPersonId").toString());

            List<Order> orders = orderRepository.findByDeliveryPersonIdAndStatusNot(deliveryPersonId, "completed");

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch current deliveries: " + e.getMessage());
        }
    }

    @PostMapping("/customerOrders")
    public ResponseEntity<?> getCustomerOrders(@RequestBody Map<String, Object> payload) {
        try {
            Long customerId = Long.valueOf(payload.get("customerId").toString());

            List<Order> orders = orderRepository.findByCustomerIdOrderByIdDesc(customerId);

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch customer orders: " + e.getMessage());
        }
    }


    @PostMapping("/updateStatus")
    public ResponseEntity<?> updateOrderStatus(@RequestBody Map<String, Object> payload) {
        try {
            Long orderId = Long.valueOf(payload.get("orderId").toString());
            String status = payload.get("status").toString();

            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid order ID"));

            order.setStatus(status);


            if ("completed".equalsIgnoreCase(status) && order.getDeliveryPerson() != null) {
                DeliveryPerson courier = order.getDeliveryPerson();
                courier.setStatus(false);
                deliveryRepository.save(courier); 
            }

            orderRepository.save(order);

            return ResponseEntity.ok("Status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/calculate")
    public ResponseEntity<Double> calculateOrderPrice(@RequestBody Map<String, Object> payload) {
        try {
    
            List<Integer> itemIdsRaw = (List<Integer>) payload.get("itemIds");
            List<Long> itemIds = itemIdsRaw.stream().map(Long::valueOf).toList();

            Map<Long, Long> counts = itemIds.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

            List<Long> uniqueIds = new ArrayList<>(counts.keySet());
            List<MenuItem> menuItems = menuItemRepository.findAllById(uniqueIds);

            Map<Long, MenuItem> menuItemsMap = menuItems.stream()
                .collect(Collectors.toMap(MenuItem::getId, Function.identity()));

            double totalPrice = 0;

            for (Map.Entry<Long, Long> entry : counts.entrySet()) {
                MenuItem menuItem = menuItemsMap.get(entry.getKey());
                if (menuItem != null) {
                    totalPrice += menuItem.getPrice() * entry.getValue();
                }
            }

            String promoCode = payload.getOrDefault("promocode", "").toString();

            totalPrice = priceCalculationService.calculate(totalPrice, promoCode);

            return ResponseEntity.ok(totalPrice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/assignDeliveryPerson")
    public ResponseEntity<?> assignDeliveryPersonToOrder(@RequestBody Map<String, Object> payload) {
        try {
            Long orderId = Long.valueOf(payload.get("orderId").toString());
            Long deliveryPersonId = Long.valueOf(payload.get("deliveryPersonId").toString());

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found"));

            if (order.getDeliveryPerson() != null) {
                return ResponseEntity.badRequest().body("Order already has a delivery person assigned");
            }

            DeliveryPerson deliveryPerson = deliveryRepository.findById(deliveryPersonId)
                    .orElseThrow(() -> new IllegalArgumentException("Delivery person not found"));

            order.setDeliveryPerson(deliveryPerson);
            deliveryPerson.setStatus(true);
            orderRepository.save(order);

            return ResponseEntity.ok("Delivery person assigned successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to assign delivery person: " + e.getMessage());
        }
    }




}

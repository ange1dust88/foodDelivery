package com.example.fooddelivery;

import com.example.fooddelivery.controllers.OrderController;
import com.example.fooddelivery.models.*;
import com.example.fooddelivery.repository.*;
import com.example.fooddelivery.services.PriceCalculationService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderRepository orderRepository;

    @MockBean
    private CustomerRepository customerRepository;

    @MockBean
    private RestaurantRepository restaurantRepository;

    @MockBean
    private MenuItemRepository menuItemRepository;

    @MockBean
    private PriceCalculationService priceCalculationService;

    @MockBean
    private DeliveryPersonRepository deliveryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateOrderSuccess() throws Exception {
        Customer customer = new Customer();
        customer.setId(1L);

        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);

        MenuItem menuItem = new MenuItem();
        menuItem.setId(1L);
        menuItem.setPrice(10.0);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));
        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(menuItem));

        Map<String, Object> request = new HashMap<>();
        request.put("customerId", 1L);
        request.put("restaurantId", 1L);
        request.put("address", "Test Address");
        request.put("totalPrice", 10.0);
        request.put("items", List.of(Map.of("id", 1L, "quantity", 1)));

        mockMvc.perform(post("/api/orders/makeOrder")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    public void testCalculateOrderPrice_withPromoCode() throws Exception {
        MenuItem item = new MenuItem();
        item.setId(1L);
        item.setPrice(10.0);

        when(menuItemRepository.findAllById(List.of(1L))).thenReturn(List.of(item));
        when(priceCalculationService.calculate(20.0, "DISCOUNT10")).thenReturn(18.0);

        Map<String, Object> request = new HashMap<>();
        request.put("itemIds", List.of(1, 1)); // 2 items
        request.put("promocode", "DISCOUNT10");

        mockMvc.perform(post("/api/orders/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("18.0"));
    }

    @Test
    public void testUpdateOrderStatus_Completed_ResetsCourierStatus() throws Exception {
        Order order = new Order();
        order.setId(1L);

        DeliveryPerson dp = new DeliveryPerson();
        dp.setId(1L);
        dp.setStatus(true);

        order.setDeliveryPerson(dp);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Map<String, Object> request = Map.of(
                "orderId", 1L,
                "status", "completed"
        );

        mockMvc.perform(post("/api/orders/updateStatus")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Status updated"));

        verify(deliveryRepository).save(any(DeliveryPerson.class));
    }

    @Test
    public void testAssignDeliveryPerson_Success() throws Exception {
        Order order = new Order();
        order.setId(1L);

        DeliveryPerson dp = new DeliveryPerson();
        dp.setId(1L);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(dp));

        Map<String, Object> request = Map.of(
                "orderId", 1L,
                "deliveryPersonId", 1L
        );

        mockMvc.perform(post("/api/orders/assignDeliveryPerson")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Delivery person assigned successfully"));
    }
}

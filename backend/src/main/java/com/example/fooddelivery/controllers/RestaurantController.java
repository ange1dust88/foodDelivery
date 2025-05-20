package com.example.fooddelivery.controllers;

import com.example.fooddelivery.models.MenuItem;
import com.example.fooddelivery.models.Restaurant;
import com.example.fooddelivery.models.RestaurantOwner;
import com.example.fooddelivery.repository.MenuItemRepository;
import com.example.fooddelivery.repository.RestaurantOwnerRepository;
import com.example.fooddelivery.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantController {

    @Autowired
    private RestaurantOwnerRepository ownerRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private MenuItemRepository menuItemRepository;

    @PostMapping("/owner/{ownerId}/restaurant")
    public ResponseEntity<String> createRestaurant(
            @PathVariable Long ownerId,
            @RequestBody Restaurant restaurant
    ) {
        Optional<RestaurantOwner> ownerOptional = ownerRepository.findById(ownerId);
        if (ownerOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Owner not found!");
        }

        RestaurantOwner owner = ownerOptional.get();
        restaurant.setOwner(owner);
        restaurantRepository.save(restaurant);

        return ResponseEntity.ok("Restaurant created successfully!");
    }

    @GetMapping("/owner/{ownerId}/restaurants")
    public ResponseEntity<?> getAllRestaurantsForOwner(@PathVariable Long ownerId) {
        List<Restaurant> restaurants = restaurantRepository.findByOwnerId(ownerId);
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/restaurant/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable Long id) {
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
        if (restaurantOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Restaurant not found!");
        }

        return ResponseEntity.ok(restaurantOptional.get());
    }

    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        return ResponseEntity.ok(restaurants);
    }


    @PostMapping("/restaurant/{id}/menu")
    public ResponseEntity<?> addMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
        if (restaurantOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Restaurant not found");
        }

        Restaurant restaurant = restaurantOptional.get();
        menuItem.setRestaurant(restaurant);
        menuItemRepository.save(menuItem);

        return ResponseEntity.ok(menuItem);
    }

    @DeleteMapping("/restaurant/{restaurantId}")
    public ResponseEntity<String> deleteRestaurant(@PathVariable Long restaurantId) {
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(restaurantId);
        if (restaurantOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Restaurant not found");
        }

        Restaurant restaurant = restaurantOptional.get();
        List<MenuItem> menuItems = menuItemRepository.findByRestaurantId(restaurantId);
        menuItemRepository.deleteAll(menuItems);

        restaurantRepository.delete(restaurant);

        return ResponseEntity.ok("Restaurant deleted successfully");
    }

    @PutMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> updateRestaurant(@PathVariable Long restaurantId, @RequestBody Restaurant updatedRestaurant) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(restaurantId);
        if (optionalRestaurant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Restaurant not found");
        }

        Restaurant restaurant = optionalRestaurant.get();
        restaurant.setName(updatedRestaurant.getName());
        restaurant.setAddress(updatedRestaurant.getAddress());
        restaurant.setPhoneNumber(updatedRestaurant.getPhoneNumber());
        restaurant.setWebSite(updatedRestaurant.getWebSite());
        restaurant.setPriceLevel(updatedRestaurant.getPriceLevel());
        restaurant.setImageUrl(updatedRestaurant.getImageUrl());
        restaurant.setLogoImageUrl(updatedRestaurant.getLogoImageUrl());

        restaurantRepository.save(restaurant);

        return ResponseEntity.ok("Restaurant updated successfully");
    }



    @DeleteMapping("/restaurant/{restaurantId}/menu/{menuItemId}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long restaurantId, @PathVariable Long menuItemId) {
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(restaurantId);
        if (restaurantOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Restaurant not found");
        }

        Optional<MenuItem> menuItemOptional = menuItemRepository.findById(menuItemId);
        if (menuItemOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Menu item not found");
        }

        MenuItem menuItem = menuItemOptional.get();
        menuItemRepository.delete(menuItem);

        return ResponseEntity.ok("Menu item deleted successfully!");
    }

    @PutMapping("/restaurant/{restaurantId}/menu/{menuItemId}")
    public ResponseEntity<?> updateMenuItem(
            @PathVariable Long restaurantId, 
            @PathVariable Long menuItemId, 
            @RequestBody MenuItem updatedMenuItem
    ) {
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(restaurantId);
        if (restaurantOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Restaurant not found");
        }

        Optional<MenuItem> menuItemOptional = menuItemRepository.findById(menuItemId);
        if (menuItemOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Menu item not found");
        }

        MenuItem menuItem = menuItemOptional.get();
        menuItem.setName(updatedMenuItem.getName());
        menuItem.setDescription(updatedMenuItem.getDescription());
        menuItem.setPrice(updatedMenuItem.getPrice());
        menuItem.setImageUrl(updatedMenuItem.getImageUrl());
        menuItem.setTag(updatedMenuItem.getTag());

        menuItemRepository.save(menuItem);

        return ResponseEntity.ok(menuItem);
    }

}

package com.example.fooddelivery;

import com.example.fooddelivery.controllers.RestaurantController;
import com.example.fooddelivery.models.MenuItem;
import com.example.fooddelivery.models.Restaurant;
import com.example.fooddelivery.models.RestaurantOwner;
import com.example.fooddelivery.repository.MenuItemRepository;
import com.example.fooddelivery.repository.RestaurantOwnerRepository;
import com.example.fooddelivery.repository.RestaurantRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RestaurantController.class)
public class RestaurantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RestaurantRepository restaurantRepository;

    @MockBean
    private RestaurantOwnerRepository ownerRepository;

    @MockBean
    private MenuItemRepository menuItemRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateRestaurant_Success() throws Exception {
        Restaurant restaurant = new Restaurant();
        restaurant.setName("Testaurant");

        RestaurantOwner owner = new RestaurantOwner();
        owner.setId(1L);

        when(ownerRepository.findById(1L)).thenReturn(Optional.of(owner));

        mockMvc.perform(post("/api/owner/1/restaurant")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(restaurant)))
                .andExpect(status().isOk())
                .andExpect(content().string("Restaurant created successfully!"));
    }

    @Test
    public void testGetRestaurantById_Success() throws Exception {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);
        restaurant.setName("Testaurant");

        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));

        mockMvc.perform(get("/api/restaurant/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Testaurant"));
    }

    @Test
    public void testAddMenuItem_Success() throws Exception {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);

        MenuItem item = new MenuItem();
        item.setName("Pizza");
        item.setPrice(10.0);

        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));

        mockMvc.perform(post("/api/restaurant/1/menu")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(item)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Pizza"));
    }

    @Test
    public void testDeleteRestaurant_Success() throws Exception {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);

        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));
        when(menuItemRepository.findByRestaurantId(1L)).thenReturn(List.of());

        mockMvc.perform(delete("/api/restaurant/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Restaurant deleted successfully"));
    }

    @Test
    public void testUpdateRestaurant_Success() throws Exception {
        Restaurant oldRestaurant = new Restaurant();
        oldRestaurant.setId(1L);
        oldRestaurant.setName("Old");

        Restaurant updatedRestaurant = new Restaurant();
        updatedRestaurant.setName("New");

        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(oldRestaurant));

        mockMvc.perform(put("/api/restaurant/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedRestaurant)))
                .andExpect(status().isOk())
                .andExpect(content().string("Restaurant updated successfully"));
    }

    @Test
    public void testGetAllRestaurantsForOwner_Success() throws Exception {
        Restaurant r1 = new Restaurant();
        r1.setId(1L);
        r1.setName("One");

        Restaurant r2 = new Restaurant();
        r2.setId(2L);
        r2.setName("Two");

        when(restaurantRepository.findByOwnerId(1L)).thenReturn(List.of(r1, r2));

        mockMvc.perform(get("/api/owner/1/restaurants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("One"))
                .andExpect(jsonPath("$[1].name").value("Two"));
    }

    @Test
    public void testDeleteMenuItem_Success() throws Exception {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);

        MenuItem menuItem = new MenuItem();
        menuItem.setId(10L);
        menuItem.setName("Burger");

        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));
        when(menuItemRepository.findById(10L)).thenReturn(Optional.of(menuItem));

        mockMvc.perform(delete("/api/restaurant/1/menu/10"))
                .andExpect(status().isOk())
                .andExpect(content().string("Menu item deleted successfully!"));
    }

    @Test
    public void testUpdateMenuItem_Success() throws Exception {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);

        MenuItem oldItem = new MenuItem();
        oldItem.setId(10L);
        oldItem.setName("Old");

        MenuItem updatedItem = new MenuItem();
        updatedItem.setName("New");
        updatedItem.setPrice(15.5);
        updatedItem.setDescription("Delicious");
        updatedItem.setImageUrl("http://img.jpg");
        updatedItem.setTag("hot");

        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));
        when(menuItemRepository.findById(10L)).thenReturn(Optional.of(oldItem));

        mockMvc.perform(put("/api/restaurant/1/menu/10")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedItem)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New"))
                .andExpect(jsonPath("$.price").value(15.5))
                .andExpect(jsonPath("$.description").value("Delicious"))
                .andExpect(jsonPath("$.imageUrl").value("http://img.jpg"))
                .andExpect(jsonPath("$.tag").value("hot"));
    }
}

package com.example.fooddelivery;

import com.example.fooddelivery.controllers.AuthController;
import com.example.fooddelivery.models.Customer;
import com.example.fooddelivery.repository.CustomerRepository;
import com.example.fooddelivery.repository.DeliveryPersonRepository;
import com.example.fooddelivery.repository.RestaurantOwnerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomerRepository customerRepository;

    @MockBean
    private RestaurantOwnerRepository ownerRepository;

    @MockBean
    private DeliveryPersonRepository deliveryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegisterCustomer_Success() throws Exception {
        Customer customer = new Customer();
        customer.setEmail("test@example.com");
        customer.setPassword("123123");
        customer.setName("John");
        customer.setSurname("Doe");
        customer.setPhoneNumber("123456789");

        when(customerRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.empty());

        when(customerRepository.save(any(Customer.class)))
                .thenReturn(customer);

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully!"));
    }

    @Test
    public void testRegisterCustomer_EmailAlreadyExists() throws Exception {
        Customer customer = new Customer();
        customer.setEmail("existing@example.com");
        customer.setPassword("123123");

        when(customerRepository.findByEmail("existing@example.com"))
                .thenReturn(Optional.of(new Customer()));

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email is already in use!"));
    }

    @Test
    public void testLoginCustomer_Success() throws Exception {
        Customer customer = new Customer();
        customer.setEmail("test@example.com");
        customer.setPassword("123123");

        Customer existingCustomer = new Customer();
        existingCustomer.setEmail("test@example.com");
        existingCustomer.setPassword("96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6caa1e");
        existingCustomer.setId(1L);
        existingCustomer.setName("John");
        existingCustomer.setSurname("Doe");
        existingCustomer.setPhoneNumber("123456789");

        when(customerRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(existingCustomer));

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("John"))
                .andExpect(jsonPath("$.surname").value("Doe"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.phoneNumber").value("123456789"));
    }

    @Test
    public void testLoginCustomer_InvalidPassword() throws Exception {
        Customer customer = new Customer();
        customer.setEmail("test@example.com");
        customer.setPassword("wrongpassword");

        Customer existingCustomer = new Customer();
        existingCustomer.setEmail("test@example.com");
        existingCustomer.setPassword("96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6caa1e");

        when(customerRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(existingCustomer));

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid password!"));
    }

    @Test
    public void testLoginCustomer_NotFound() throws Exception {
        Customer customer = new Customer();
        customer.setEmail("notfound@example.com");
        customer.setPassword("123123");

        when(customerRepository.findByEmail("notfound@example.com"))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User not found!"));
    }
}

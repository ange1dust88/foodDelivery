package com.example.fooddelivery.controllers;

import com.example.fooddelivery.models.Customer;
import com.example.fooddelivery.models.DeliveryPerson;
import com.example.fooddelivery.models.RestaurantOwner;
import com.example.fooddelivery.repository.CustomerRepository;
import com.example.fooddelivery.repository.DeliveryPersonRepository;
import com.example.fooddelivery.repository.RestaurantOwnerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import java.security.MessageDigest;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired(required = true)
    private CustomerRepository customerRepository;

    @Autowired(required = true)
    private RestaurantOwnerRepository ownerRepository;

    @Autowired(required = true)
    private DeliveryPersonRepository deliveryRepository;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final Pattern emailPattern = Pattern.compile(EMAIL_REGEX);

    private boolean isValidEmail(String email) {
        Matcher matcher = emailPattern.matcher(email);
        return matcher.matches();
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(Integer.toHexString(0xFF & b));
            }
            return hexString.toString();  
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error while hashing the password", e);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Customer customer) {

        if (!isValidEmail(customer.getEmail())) {
            return ResponseEntity.badRequest().body("Invalid email format!");
        }

        Optional<Customer> existingEmailUser = customerRepository.findByEmail(customer.getEmail());
        if (existingEmailUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        String hashedPassword = hashPassword(customer.getPassword());
        customer.setPassword(hashedPassword);

        customerRepository.save(customer);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Customer customer) {

        Optional<Customer> existingCustomer = customerRepository.findByEmail(customer.getEmail());
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        String hashedPassword = hashPassword(customer.getPassword());
        if (!hashedPassword.equals(existingCustomer.get().getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password!");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("id", existingCustomer.get().getId());
        response.put("name", existingCustomer.get().getName());
        response.put("surname", existingCustomer.get().getSurname());
        response.put("phoneNumber", existingCustomer.get().getPhoneNumber());
        response.put("email", existingCustomer.get().getEmail());
        return ResponseEntity.ok(response);
    }


    @PostMapping("/owner/register")
    public ResponseEntity<String> registerOwner(@RequestBody RestaurantOwner owner) {
        if (!isValidEmail(owner.getEmail())) {
            return ResponseEntity.badRequest().body("Invalid email format!");
        }

        if (ownerRepository.findByEmail(owner.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        owner.setPassword(hashPassword(owner.getPassword()));
        ownerRepository.save(owner);

        return ResponseEntity.ok("Owner registered successfully!");
    }


    @PostMapping("/owner/login")
    public ResponseEntity<?> loginOwner(@RequestBody RestaurantOwner owner) {
        Optional<RestaurantOwner> existingOwner = ownerRepository.findByEmail(owner.getEmail());

        if (existingOwner.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        String hashedPassword = hashPassword(owner.getPassword());

        if (!hashedPassword.equals(existingOwner.get().getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password!");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("id", existingOwner.get().getId());
        response.put("name", existingOwner.get().getName());
        response.put("surname", existingOwner.get().getSurname());
        response.put("email", existingOwner.get().getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/delivery/register")
    public ResponseEntity<String> registerDeliveryPerson(@RequestBody DeliveryPerson deliveryPerson) {
        if (!isValidEmail(deliveryPerson.getEmail())) {
            return ResponseEntity.badRequest().body("Invalid email format!");
        }

        if (deliveryRepository.findByEmail(deliveryPerson.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        deliveryPerson.setPassword(hashPassword(deliveryPerson.getPassword()));
        deliveryRepository.save(deliveryPerson);

        return ResponseEntity.ok("Owner registered successfully!");
    }


    @PostMapping("/delivery/login")
    public ResponseEntity<?> loginDeliveryPerson(@RequestBody DeliveryPerson deliveryPerson) {
        Optional<DeliveryPerson> existingDeliveryPerson = deliveryRepository.findByEmail(deliveryPerson.getEmail());

        if (existingDeliveryPerson.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        String hashedPassword = hashPassword(deliveryPerson.getPassword());

        if (!hashedPassword.equals(existingDeliveryPerson.get().getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password!");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("id", existingDeliveryPerson.get().getId());
        response.put("name", existingDeliveryPerson.get().getName());
        response.put("surname", existingDeliveryPerson.get().getSurname());
        response.put("email", existingDeliveryPerson.get().getEmail());
        response.put("phoneNumber", existingDeliveryPerson.get().getPhoneNumber());
        response.put("status", existingDeliveryPerson.get().getStatus());

        return ResponseEntity.ok(response);
    }



}
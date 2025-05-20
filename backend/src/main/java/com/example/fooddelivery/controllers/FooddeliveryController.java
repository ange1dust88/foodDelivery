package com.example.fooddelivery.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FooddeliveryController {
    
    @GetMapping("/api/fooddelivery")
    public String FooddeliveryMessage() {

        return "hello world";
    }
}

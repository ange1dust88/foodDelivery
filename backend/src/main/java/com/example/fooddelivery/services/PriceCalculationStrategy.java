package com.example.fooddelivery.services;

import com.example.fooddelivery.models.MenuItem;
import java.util.List;


public interface PriceCalculationStrategy {
    double calculateTotal(List<MenuItem> items, String promoCode);
}

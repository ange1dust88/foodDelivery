package com.example.fooddelivery.services;

import com.example.fooddelivery.models.MenuItem;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("promo10Strategy")
public class Promo10Strategy implements PriceCalculationStrategy {
    @Override
    public double calculateTotal(List<MenuItem> items, String promoCode) {
        double base = items.stream().mapToDouble(MenuItem::getPrice).sum();
        return base * 0.9;
    }
}

package com.example.fooddelivery.services;

import com.example.fooddelivery.models.MenuItem;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("defaultPriceStrategy")
public class DefaultPriceCalculationStrategy implements PriceCalculationStrategy {
    @Override
    public double calculateTotal(List<MenuItem> items, String promoCode) {
        return items.stream().mapToDouble(MenuItem::getPrice).sum();
    }
}

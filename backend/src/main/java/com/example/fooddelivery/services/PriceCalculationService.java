package com.example.fooddelivery.services;

import com.example.fooddelivery.models.MenuItem;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PriceCalculationService {

    private final Map<String, PriceCalculationStrategy> strategies;

    public PriceCalculationService(List<PriceCalculationStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(
                        s -> s.getClass().getAnnotation(Service.class).value(),
                        s -> s
                ));
    }

    

    public double calculate(double rawTotal, String promoCode) {
    double delivery_fee = 5.0;
    double discountedTotal = rawTotal;
    if (promoCode != null && promoCode.equalsIgnoreCase("PROMO10")) {
        discountedTotal = rawTotal * 0.9; 
    }
    return discountedTotal + delivery_fee;
}

}

package com.example.fooddelivery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.fooddelivery.models.Customer;
import com.example.fooddelivery.models.Order;
import com.example.fooddelivery.models.Restaurant;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer(Customer customer);
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.restaurant = :restaurant")
    List<Order> findByRestaurantWithItems(@Param("restaurant") Restaurant restaurant);
    List<Order> findByDeliveryPersonIsNull();
    List<Order> findByDeliveryPersonIsNullAndStatusIn(List<String> statuses);
    List<Order> findByDeliveryPersonIdAndStatusNot(Long deliveryPersonId, String status);
    List<Order> findByCustomerIdOrderByIdDesc(Long customerId);
}
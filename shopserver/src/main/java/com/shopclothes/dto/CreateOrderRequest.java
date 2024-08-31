package com.shopclothes.dto;

import com.shopclothes.model.Customer;
import com.shopclothes.model.OrderItem;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private Customer customer;
    private List<OrderItem> items;
}
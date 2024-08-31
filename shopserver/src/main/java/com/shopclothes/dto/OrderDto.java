package com.shopclothes.dto;

import com.shopclothes.model.OrderItem;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class OrderDto {
    private Long customerId;
    private Double totalAmount;
    private String statusOrder;

    private String orderCode;


    private LocalDateTime orderDate;

    private String phoneNumber;

    private String firstName;

    private String address;

    private Long orderId;

    private List<OrderItemDto> orderItems;

    private String lastName;


}

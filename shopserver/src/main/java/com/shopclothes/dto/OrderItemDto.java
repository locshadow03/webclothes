package com.shopclothes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderItemDto {
    private Long productId;
    private String productName;
    private String size;
    private Integer quantity;
    private double price;
    private double disCount;
    private String imageProduct;
}

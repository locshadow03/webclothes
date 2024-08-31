package com.shopclothes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopProductOrderDto {
    private Long id;

    private String img;

    private String nameProduct;

    private double price;

    private double discount;

    private int totalProductOrder;
}

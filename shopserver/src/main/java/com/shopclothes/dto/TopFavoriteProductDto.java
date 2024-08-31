package com.shopclothes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopFavoriteProductDto {
    private Long id;
    private String avatar;
    private String nameProduct;
    private Double price;
    private Double discount;
    private Integer totalFavoriteProduct;
}

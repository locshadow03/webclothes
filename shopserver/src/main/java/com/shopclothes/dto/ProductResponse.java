package com.shopclothes.dto;


import com.shopclothes.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Product product;
    private Integer totalProduct;
}

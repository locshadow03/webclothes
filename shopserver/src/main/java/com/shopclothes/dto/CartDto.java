package com.shopclothes.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.shopclothes.model.CartItem;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class CartDto {
    private Long productId;
    private Long cartId;
    private Long cartItemId;
    private Long customerId;
    private String nameProduct;
    private String imageProduct;
    private int quantity;
    private Double price;
    private Double disCount;
    private String size;
    private String status;
    private List<CartItem> cartItems;
}

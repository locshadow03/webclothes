package com.shopclothes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Base64;

@Data
@NoArgsConstructor
public class FavoriteProductDto {
    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private double disCount;
    private double price;
    private String productImage;
    private LocalDateTime dateAdded;

    public FavoriteProductDto(String productName, double disCount, double price, String productImage) {
        this.productName = productName;
        this.disCount = disCount;
        this.price = price;
        this.productImage = productImage;
    }

    public FavoriteProductDto(Long id, String productName, double disCount, double price, byte[] photoBytes) {
        this.id = id;
        this.productName = productName;
        this.disCount = disCount;
        this.price = price;
        this.productImage = photoBytes != null ? Base64.getEncoder().encodeToString(photoBytes) : null;
    }
}

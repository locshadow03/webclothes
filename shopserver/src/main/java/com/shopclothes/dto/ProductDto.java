package com.shopclothes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Data
@NoArgsConstructor
public class ProductDto {
    private Long productId;
    private String name;
    private String code;
    private String nameCategory;
    private String description;
    private double price;
    private String imageProduct;
    private String nameBrand;
    private double disCount;
    private int viewCount;
    private List<SizeQuantityDto> sizeQuantities;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    public ProductDto(String name, String code, String nameCategory, String description, double price, String nameBrand, double disCount) {
        this.name = name;
        this.code = code;
        this.nameCategory = nameCategory;
        this.description = description;
        this.price = price;
        this.nameBrand = nameBrand;
        this.disCount = disCount;
    }

    public ProductDto(Long productId, String name, double price, byte[] photoBytes, double disCount, int viewCount) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.imageProduct = photoBytes != null ? Base64.getEncoder().encodeToString(photoBytes) : null;
        this.disCount = disCount;
        this.viewCount = viewCount;
    }

    public ProductDto(Long productId, String name, String code, String nameCategory, String description, double price, byte[] photoBytes, String nameBrand, List<SizeQuantityDto> sizeQuantities, LocalDateTime createdAt, LocalDateTime updatedAt, double disCount, int viewCount) {
        this.productId = productId;
        this.name = name;
        this.code = code;
        this.nameCategory = nameCategory;
        this.description = description;
        this.price = price;
        this.sizeQuantities = sizeQuantities;
        this.imageProduct = photoBytes != null ? Base64.getEncoder().encodeToString(photoBytes) : null;
        this.nameBrand = nameBrand;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.disCount = disCount;
        this.viewCount = viewCount;
    }
}

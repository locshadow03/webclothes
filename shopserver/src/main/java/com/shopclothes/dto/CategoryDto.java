package com.shopclothes.dto;

import com.shopclothes.model.Product;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Blob;
import java.util.Base64;
import java.util.List;

@Data
@NoArgsConstructor
public class CategoryDto {
    private Long id;

    private String nameCategory;

    private String imageCategory;

    public CategoryDto(Long id, String nameCategory) {
        this.id = id;
        this.nameCategory = nameCategory;
    }

    public CategoryDto(Long id, String nameCategory, byte[] photoBytes) {
        this.id = id;
        this.nameCategory = nameCategory;
        this.imageCategory = photoBytes != null ? Base64.getEncoder().encodeToString(photoBytes) : null;
    }

}

package com.shopclothes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;
import java.util.Base64;

@Data
@NoArgsConstructor
public class BrandDto {
    private Long id;

    private String nameBrand;

    private String imageBrand;

    public BrandDto(Long id, String nameBrand) {
        this.id = id;
        this.nameBrand = nameBrand;
    }

    public BrandDto(Long id, String nameBrand, byte[] photoBytes) {
        this.id = id;
        this.nameBrand = nameBrand;
        this.imageBrand = photoBytes != null ? Base64.getEncoder().encodeToString(photoBytes) : null;
    }
}

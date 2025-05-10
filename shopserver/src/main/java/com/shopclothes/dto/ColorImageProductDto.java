package com.shopclothes.dto;

import com.shopclothes.model.ColorImageProduct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColorImageProductDto {
    private Long id;
    private String color;
    private String imageProduct;
    private int quantity;
    private String previewUrl;


    public ColorImageProductDto(ColorImageProduct colorImageProduct) {
        if (colorImageProduct != null) {
            this.id = colorImageProduct.getId();
            this.color = colorImageProduct.getColor();
            this.imageProduct = colorImageProduct.getImageProduct();
            this.quantity = colorImageProduct.getQuantity();
        }
    }

    public ColorImageProductDto(ColorImageProductDto colorImageProductDto) {
    }
}

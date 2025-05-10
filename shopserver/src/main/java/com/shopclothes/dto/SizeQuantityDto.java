package com.shopclothes.dto;

import com.shopclothes.model.ColorImageProduct;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class SizeQuantityDto {
    private Long id;
    private String size;
    private List<ColorImageProductDto> colorImageProductDtos;

    public SizeQuantityDto(Long id, String size, List<ColorImageProduct> colorImageProductDtos) {
        this.id = id;
        this.size = size;
        this.colorImageProductDtos = colorImageProductDtos.stream()
                .map(colorImageProduct -> new ColorImageProductDto(colorImageProduct)) // Gọi constructor của DTO
                .collect(Collectors.toList());

    }
}

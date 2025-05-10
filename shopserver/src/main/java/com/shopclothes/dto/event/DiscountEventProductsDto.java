package com.shopclothes.dto.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountEventProductsDto {
    private Long eventProduct_id;
    private Double discountAmount;

    private boolean isPercentage;
}

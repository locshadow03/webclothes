package com.shopclothes.dto.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountAndPercentage {
    private Double discount;
    private boolean isPercentage;
    private double priceNow;
}

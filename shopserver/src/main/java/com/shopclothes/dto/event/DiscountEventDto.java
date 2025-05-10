package com.shopclothes.dto.event;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountEventDto {
    private Long id;
    private String name_event;
    private String descriptionEvent;
    private String img_event;
    private LocalDate startDate;
    private LocalDate endDate;

    private List<Long> product_id;

    private List<Long> brand_id;

    private List<Long> category_id;

    private Double discountAmount;

    private boolean isPercentage;
}
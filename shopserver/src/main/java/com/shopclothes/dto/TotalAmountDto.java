package com.shopclothes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TotalAmountDto {
    private Double totalAmountToday;
    private Double totalAmountThisMonth;
    private Double totalAmountThisYear;
    private Double totalAmountAllTime;
}


package com.shopclothes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TotalUser {
    Long totalUserToday;
    Long totalUserMonth;
    Long totalUserYear;
    Long totalUserAll;
}

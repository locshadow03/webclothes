package com.shopclothes.dto;

import com.shopclothes.model.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerTotalAmountDto {
    private Customer customer;
    private Double totalAmount;
}

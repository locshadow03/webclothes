package com.shopclothes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopCustomerDto {

    private Long id;

    private  String lastName;

    private String firstName;

    private String phoneNumber;

    private String address;

    private Double totalAmount;
}

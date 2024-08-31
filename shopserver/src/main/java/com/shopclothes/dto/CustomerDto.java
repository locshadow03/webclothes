package com.shopclothes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {
    private Long customerId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String avatar;
    private Long userId;
    private UserDto userDto;
    private String status;

    public CustomerDto(Long customerId, String firstName, String lastName, String phoneNumber, String address, byte[] photoBytes) {
        this.customerId = customerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.avatar = photoBytes != null ? Base64.getEncoder().encodeToString(photoBytes) : null;
    }
}

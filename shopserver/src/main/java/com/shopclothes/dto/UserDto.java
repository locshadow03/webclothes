package com.shopclothes.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.shopclothes.model.User;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)

public class UserDto {
    private Long id;
    private  int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String role;

    private Long customerId;

    @Email(message = "Email should be valid")
    @Size(min = 5, max = 50, message = "Email should be between 5 and 50 characters")
    private String email;
    @Size(min = 3, max = 10, message = "Username contains 3-10 characters")
    private String username;
    @Size(min = 6, max = 10, message = "Password contains 3-10 characters")
    private String password;
    private String repeatPassword;
    private Date createdAt;
    private Date updatedAt;
    private User ourUsers;
    private List<User> ourUserList;
}

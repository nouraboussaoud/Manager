package com.na.manager.manager.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {
    
    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;
}
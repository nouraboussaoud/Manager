package com.na.manager.manager.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ExternalUserRequest {
    
    @NotBlank(message = "First name is required")
    private String firstname;
    
    @NotBlank(message = "Last name is required")
    private String lastname;
    
    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;
    
    private String department;
    private String position;
}
package com.na.manager.manager.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    
    @NotBlank(message = "First name is required")
    private String firstname;
    
    @NotBlank(message = "Last name is required")
    private String lastname;
    
    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;
    
    private boolean enabled = true;
}
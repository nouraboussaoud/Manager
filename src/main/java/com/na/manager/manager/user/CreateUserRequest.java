package com.na.manager.manager.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {
    
    @NotBlank(message = "First name is required")
    private String firstname;
    
    @NotBlank(message = "Last name is required")
    private String lastname;
    
    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 12, message = "Password must be at least 12 characters long")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$",
        message = "Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character (@$!%*?&), and be at least 12 characters long"
    )
    private String password;
    
    private boolean enabled = true;
}

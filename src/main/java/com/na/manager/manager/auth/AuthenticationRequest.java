package com.na.manager.manager.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationRequest {
    @Email(message = "Email is not formatted")
    @NotEmpty(message = "email is mandatory ")
    @NotBlank(message ="email is mandatory" )
    private String email;
    @NotEmpty(message = "password is mandatory ")
    @NotBlank(message ="password is mandatory" )
    @Size(min = 8, message = "Password must be at least 8 characters long") // Temporarily back to 8
    private String password;
}

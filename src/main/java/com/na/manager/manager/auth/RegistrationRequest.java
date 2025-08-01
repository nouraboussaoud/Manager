package com.na.manager.manager.auth;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class RegistrationRequest {
    @NotEmpty(message = "firstname is mandatory ")
    @NotBlank(message ="Firstname is mandatory" )
    private String firstname;
    @NotEmpty(message = "Lastname is mandatory ")
    @NotBlank(message ="Lastname is mandatory" )
    private String lastname;
    @Email(message = "Email is not formatted")
    @NotEmpty(message = "email is mandatory ")
    @NotBlank(message ="email is mandatory" )
    private String email;
    @NotEmpty(message = "password is mandatory ")
    @NotBlank(message ="password is mandatory" )
    @Size(min = 12, message = "Password must be at least 12 characters long")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$",
        message = "Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character (@$!%*?&), and be at least 12 characters long"
    )
    private String password;
}

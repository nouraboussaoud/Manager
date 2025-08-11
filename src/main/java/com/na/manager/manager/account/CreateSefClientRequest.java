package com.na.manager.manager.account;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSefClientRequest {
    
    @NotBlank(message = "Identity is required")
    private String identite;
    
    @NotBlank(message = "National PID is required")
    @JsonProperty("nat_pid")
    private String natPid;
    
    @NotBlank(message = "Password is required")
    private String pwd;
    
    @NotBlank(message = "Label is required")
    private String libelle;
    
    @NotBlank(message = "Address is required")
    private String adresse;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    private String mobile;
    
    @NotNull(message = "TradeQB flag is required")
    @JsonProperty("tradeQB")
    private Boolean tradeQB;
    
    @JsonProperty("keycloak_user_id")
    private String keycloakUserId;
}
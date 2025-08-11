package com.na.manager.manager.account;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SefClient {
    
    private String identite;
    
    @JsonProperty("nat_pid")
    private String natPid;
    
    private String pwd;
    
    private String libelle;
    
    private String adresse;
    
    private String email;
    
    private String mobile;
    
    @JsonProperty("lastPwdChange")
    private LocalDateTime lastPwdChange;
    
    @JsonProperty("tradeQB")
    private Boolean tradeQB;
    
    @JsonProperty("keycloak_user_id")
    private String keycloakUserId;
    
    @JsonProperty("created_date")
    private LocalDateTime createdDate;
    
    @JsonProperty("last_modified_date")
    private LocalDateTime lastModifiedDate;
}
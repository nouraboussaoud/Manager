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
public class Account {
    
    @JsonProperty("cod_cli")
    private Integer codCli;
    
    private String libcli;
    
    private String identite;
    
    private Integer trade;
    
    private String adress;
    
    @JsonProperty("ind_societe")
    private String indSociete;
    
    @JsonProperty("chef_file")
    private String chefFile;
    
    private Boolean cloture;
    
    private Boolean disabled;
    
    @JsonProperty("keycloak_user_id")
    private String keycloakUserId;
    
    @JsonProperty("user_email")
    private String userEmail;
    
    @JsonProperty("user_name")
    private String userName;
    
    @JsonProperty("created_date")
    private LocalDateTime createdDate;
    
    @JsonProperty("last_modified_date")
    private LocalDateTime lastModifiedDate;
    
    private LocalClient localcli;
}
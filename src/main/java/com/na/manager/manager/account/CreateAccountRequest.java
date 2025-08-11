package com.na.manager.manager.account;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountRequest {
    
    @NotNull(message = "Client code is required")
    @JsonProperty("cod_cli")
    private Integer codCli;
    
    @NotBlank(message = "Client name is required")
    private String libcli;
    
    @NotBlank(message = "Identity is required")
    private String identite;
    
    private Integer trade;
    
    private String adress;
    
    @JsonProperty("ind_societe")
    private String indSociete;
    
    @JsonProperty("chef_file")
    private String chefFile;
    
    private Boolean cloture = false;
    
    private Boolean disabled = false;
    
    private LocalClient localcli;
}
package com.na.manager.manager.account;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountRequest {
    
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
    
    private LocalClient localcli;
}
package com.na.manager.manager.account;

import com.na.manager.manager.keycloak.KeycloakUserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserWithAccounts {
    
    private KeycloakUserDTO user;
    
    private List<Account> accounts;
    
    private int accountCount;
    
    private int activeAccountCount;
    
    private int disabledAccountCount;
}
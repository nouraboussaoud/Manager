package com.na.manager.manager.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "app.security.password")
@Data
public class PasswordPolicyConfig {
    
    private int minLength = 12;
    private boolean requireUppercase = true;
    private boolean requireLowercase = true;
    private boolean requireNumbers = true;
    private boolean requireSpecialChars = true;
    private String allowedSpecialChars = "@$!%*?&";
    private boolean preventCommonPatterns = true;
    private int maxRepeatingChars = 3;
    
    public String getValidationRegex() {
        return "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[" + 
               allowedSpecialChars.replaceAll("([\\[\\]{}()*+?.\\\\^$|])", "\\\\$1") + 
               "])[A-Za-z\\d" + allowedSpecialChars + "]{" + minLength + ",}$";
    }
}
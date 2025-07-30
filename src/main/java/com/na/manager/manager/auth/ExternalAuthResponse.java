package com.na.manager.manager.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExternalAuthResponse {
    private String accessToken;
    private String userId;
    private String email;
    private String firstname;
    private String lastname;
    private boolean requiresPasswordChange;
}
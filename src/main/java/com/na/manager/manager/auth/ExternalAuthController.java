package com.na.manager.manager.auth;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/external-auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "External Authentication")
public class ExternalAuthController {
    
    private final ExternalAuthService externalAuthService;

    @PostMapping("/create-user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> createExternalUser(@RequestBody @Valid ExternalUserRequest request) {
        try {
            String userId = externalAuthService.createExternalUser(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body("External user created successfully. Welcome email sent to: " + request.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send welcome email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body("User created but failed to send welcome email");
        } catch (Exception e) {
            log.error("Failed to create external user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body("Failed to create external user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ExternalAuthResponse> loginExternalUser(@RequestBody @Valid ExternalAuthRequest request) {
        log.info("=== External login request received ===");
        log.info("Email: {}", request.getEmail());
        log.info("Password provided: {}", request.getPassword() != null && !request.getPassword().isEmpty());
        
        try {
            ExternalAuthResponse response = externalAuthService.authenticateExternalUser(request);
            log.info("External login successful for: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("External login failed for {}: {}", request.getEmail(), e.getMessage());
            log.error("Full exception: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid EmailRequest request) {
        try {
            externalAuthService.sendExternalPasswordReset(request.getEmail());
            return ResponseEntity.ok("Password reset email sent");
        } catch (Exception e) {
            log.error("Failed to send password reset: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body("Failed to send password reset email");
        }
    }
}

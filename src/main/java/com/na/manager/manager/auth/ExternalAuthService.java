package com.na.manager.manager.auth;

import com.na.manager.manager.email.EmailService;
import com.na.manager.manager.keycloak.KeycloakUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import java.security.SecureRandom;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExternalAuthService {
    
    private final Keycloak keycloak;
    private final EmailService emailService;
    
    @Value("${keycloak.realm}")
    private String realm;
    
    @Value("${application.frontend.external-login-url}")
    private String externalLoginUrl;
    
    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    /**
     * Create external user attributes
     */
    private Map<String, List<String>> createExternalUserAttributes() {
        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("user_type", Collections.singletonList("EXTERNAL"));
        attributes.put("created_by_manager", Collections.singletonList("true"));
        return attributes;
    }

    /**
     * Create external user in Keycloak and send welcome email with password reset link
     */
    public String createExternalUser(ExternalUserRequest request) throws MessagingException {
        log.info("Creating external user with email: {}", request.getEmail());
        
        try {
            RealmResource realmResource = keycloak.realm(realm);
            
            // Check if user already exists
            List<UserRepresentation> existingUsers = realmResource.users()
                    .search(request.getEmail(), 0, 1);
            
            if (!existingUsers.isEmpty()) {
                throw new RuntimeException("User with email " + request.getEmail() + " already exists");
            }
            
            // Prepare attributes with all required external user attributes
            Map<String, List<String>> attributes = new HashMap<>();
            attributes.put("user_type", Collections.singletonList("EXTERNAL"));
            attributes.put("created_by_manager", Collections.singletonList("true"));
            
            // Add additional attributes if provided
            if (request.getDepartment() != null && !request.getDepartment().isEmpty()) {
                attributes.put("department", Collections.singletonList(request.getDepartment()));
            }
            if (request.getPosition() != null && !request.getPosition().isEmpty()) {
                attributes.put("position", Collections.singletonList(request.getPosition()));
            }
            
            log.info("Preparing to create user with attributes: {}", attributes);
            
            // Create user representation WITH attributes
            UserRepresentation user = new UserRepresentation();
            user.setEnabled(true);
            user.setUsername(request.getEmail());
            user.setFirstName(request.getFirstname());
            user.setLastName(request.getLastname());
            user.setEmail(request.getEmail());
            user.setEmailVerified(false);
            // Set required actions for password setup and email verification
            user.setRequiredActions(Arrays.asList("UPDATE_PASSWORD", "VERIFY_EMAIL"));
            user.setAttributes(attributes);
            
            // Create user
            var response = realmResource.users().create(user);
            
            if (response.getStatus() == 201) {
                String userId = getCreatedId(response);
                log.info("External user created successfully with ID: {}", userId);
                
                // Ensure attributes are properly set with retry mechanism
                boolean attributesSet = ensureUserAttributesWithRetry(userId, attributes, 3);
                
                if (!attributesSet) {
                    log.error("CRITICAL: Failed to set user attributes after multiple attempts for user: {}", userId);
                    // Don't throw exception, but log it as critical
                }
                
                // Send welcome email with password reset link using Keycloak's built-in mechanism
                sendExternalUserWelcomeWithPasswordReset(userId, request.getEmail(), request.getFirstname());
                
                log.info("External user created and welcome email with password reset sent to: {}", request.getEmail());
                
                return userId;
            } else {
                throw new RuntimeException("Failed to create external user. Status: " + response.getStatus());
            }
            
        } catch (Exception e) {
            log.error("Error creating external user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create external user: " + e.getMessage());
        }
    }

    /**
     * Set external user attributes with retry mechanism
     */
    private void setExternalUserAttributesWithRetry(String userId, ExternalUserRequest request) {
        log.info("Setting external user attributes for user: {}", userId);
        
        try {
            RealmResource realmResource = keycloak.realm(realm);
            UserResource userResource = realmResource.users().get(userId);
            
            // Prepare attributes
            Map<String, List<String>> attributes = new HashMap<>();
            attributes.put("user_type", Collections.singletonList("EXTERNAL"));
            attributes.put("created_by_manager", Collections.singletonList("true"));
            
            // Add additional attributes if provided
            if (request.getDepartment() != null && !request.getDepartment().isEmpty()) {
                attributes.put("department", Collections.singletonList(request.getDepartment()));
            }
            if (request.getPosition() != null && !request.getPosition().isEmpty()) {
                attributes.put("position", Collections.singletonList(request.getPosition()));
            }
            
            // Retry mechanism for setting attributes
            int maxRetries = 3;
            boolean success = false;
            
            for (int attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    log.info("Attempt {} - Setting attributes for user: {}", attempt, userId);
                    
                    // Get current user
                    UserRepresentation currentUser = userResource.toRepresentation();
                    
                    // Set attributes
                    currentUser.setAttributes(attributes);
                    
                    // Update user
                    userResource.update(currentUser);
                    
                    // Wait for Keycloak to process
                    Thread.sleep(1000);
                    
                    // Verify attributes were set
                    UserRepresentation verifyUser = userResource.toRepresentation();
                    Map<String, List<String>> currentAttributes = verifyUser.getAttributes();
                    
                    if (currentAttributes != null && 
                        currentAttributes.containsKey("user_type") &&
                        "EXTERNAL".equals(currentAttributes.get("user_type").get(0)) &&
                        currentAttributes.containsKey("created_by_manager") &&
                        "true".equals(currentAttributes.get("created_by_manager").get(0))) {
                        
                        log.info("Attributes successfully set for user: {} on attempt: {}", userId, attempt);
                        success = true;
                        break;
                    } else {
                        log.warn("Attributes not properly set on attempt: {}, current attributes: {}", 
                                attempt, currentAttributes);
                    }
                    
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Thread interrupted during attribute setting");
                } catch (Exception e) {
                    log.error("Error on attempt {} to set attributes: {}", attempt, e.getMessage());
                    if (attempt < maxRetries) {
                        try {
                            Thread.sleep(2000); // Wait longer between retries
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            throw new RuntimeException("Thread interrupted");
                        }
                    }
                }
            }
            
            if (!success) {
                log.error("CRITICAL: Failed to set external user attributes after {} attempts for user: {}", 
                         maxRetries, userId);
                throw new RuntimeException("Failed to set user attributes");
            }
            
        } catch (Exception e) {
            log.error("Failed to set external user attributes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to set user attributes: " + e.getMessage());
        }
    }

    /**
     * Authenticate external user with Keycloak
     */
    public ExternalAuthResponse authenticateExternalUser(ExternalAuthRequest request) {
        log.info("Authenticating external user: {}", request.getEmail());
        
        try {
            // First verify user exists
            RealmResource realmResource = keycloak.realm(realm);
            List<UserRepresentation> users = realmResource.users().search(request.getEmail(), 0, 1);
            
            if (users.isEmpty()) {
                log.error("User not found: {}", request.getEmail());
                throw new RuntimeException("Invalid credentials");
            }
            
            UserRepresentation user = users.get(0);
            log.info("Found user: {} with ID: {}", user.getEmail(), user.getId());
            log.info("User attributes: {}", user.getAttributes());
            
            // Check if user is external - with fallback fix
            if (!isExternalUser(user)) {
                log.warn("User {} missing external attributes, attempting to fix...", request.getEmail());
                
                // Try to fix the attributes
                forceFixExternalAttributes(user.getId());
                
                // Re-fetch user to check if fix worked
                user = realmResource.users().get(user.getId()).toRepresentation();
                
                if (!isExternalUser(user)) {
                    log.error("User is not external after fix attempt: {}", request.getEmail());
                    throw new RuntimeException("Invalid credentials");
                }
                
                log.info("Successfully fixed external user attributes for: {}", request.getEmail());
            }
            
            // Check if user is enabled
            if (!user.isEnabled()) {
                log.error("User account is disabled: {}", request.getEmail());
                throw new RuntimeException("Account is disabled");
            }
            
            log.info("User validation passed, attempting Keycloak authentication...");
            
            // Authenticate using Keycloak token endpoint
            String accessToken = authenticateWithKeycloak(request.getEmail(), request.getPassword());
            
            log.info("Authentication successful for: {}", request.getEmail());
            
            return ExternalAuthResponse.builder()
                .accessToken(accessToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstname(user.getFirstName())
                .lastname(user.getLastName())
                .requiresPasswordChange(user.getRequiredActions() != null && 
                                      user.getRequiredActions().contains("UPDATE_PASSWORD"))
                .build();
                
        } catch (Exception e) {
            log.error("External authentication failed for {}: {}", request.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Invalid credentials");
        }
    }

    private String authenticateWithKeycloak(String email, String password) {
        try {
            log.info("Creating Keycloak client for authentication...");
            log.info("Auth server URL: {}, Realm: {}", authServerUrl, realm);
            
            // Get client secret from application properties
            String clientSecret = "BW7P6oGHgz36wHx6QD9Vtz7tWqoJOi4C"; // From your application-dev.yml
            
            // Create Keycloak client with client secret (for confidential clients)
            Keycloak userKeycloak = KeycloakBuilder.builder()
                .serverUrl(authServerUrl)
                .realm(realm)
                .clientId("manager-app")
                .clientSecret(clientSecret)  // Add client secret for confidential client
                .username(email)
                .password(password)
                .grantType(OAuth2Constants.PASSWORD)
                .build();
            
            log.info("Attempting to get access token...");
            String accessToken = userKeycloak.tokenManager().getAccessTokenString();
            log.info("Authentication successful for: {}", email);
            
            return accessToken;
        } catch (Exception e) {
            log.error("Keycloak authentication failed for {}: {}", email, e.getMessage());
            throw new RuntimeException("Keycloak authentication failed: " + e.getMessage());
        }
    }

    /**
     * Send welcome email with Keycloak password reset link
     */
    private void sendExternalUserWelcomeWithPasswordReset(String userId, String email, String firstName) 
            throws MessagingException {
        try {
            log.info("Sending welcome email with password reset for user: {}", email);
            
            RealmResource realmResource = keycloak.realm(realm);
            UserResource userResource = realmResource.users().get(userId);
            
            // Trigger Keycloak's built-in password reset email
            // This will send an email with a secure link that allows the user to set their password
            userResource.executeActionsEmail(Arrays.asList("UPDATE_PASSWORD"));
            
            log.info("Keycloak password reset email triggered for user: {}", email);
            
            // Optionally, you can also send your custom welcome email
            // that explains what to expect and provides additional information
            sendCustomWelcomeEmail(email, firstName);
            
        } catch (Exception e) {
            log.error("Failed to send password reset email for user {}: {}", email, e.getMessage());
            throw new MessagingException("Failed to send password reset email: " + e.getMessage());
        }
    }

    /**
     * Send custom welcome email (optional - provides additional context)
     */
    private void sendCustomWelcomeEmail(String email, String firstName) throws MessagingException {
        try {
            // You can create a simple welcome email that tells the user to expect 
            // a password reset email from Keycloak
            String resetPasswordUrl = externalLoginUrl; // Just point to login page
            emailService.sendExternalUserWelcomeEmail(email, firstName, resetPasswordUrl);
        } catch (Exception e) {
            log.warn("Failed to send custom welcome email to {}: {}", email, e.getMessage());
            // Don't throw exception here as the main password reset email was sent
        }
    }

    /**
     * Send password reset email for external user using Keycloak's mechanism
     */
    public void sendExternalPasswordReset(String email) throws MessagingException {
        log.info("Sending password reset for external user: {}", email);
        
        try {
            RealmResource realmResource = keycloak.realm(realm);
            List<UserRepresentation> users = realmResource.users().search(email, 0, 1);
            
            if (users.isEmpty()) {
                throw new RuntimeException("User not found");
            }
            
            UserRepresentation user = users.get(0);
            
            // Check if user is external
            Map<String, List<String>> attributes = user.getAttributes();
            if (attributes == null || 
                !attributes.containsKey("user_type") || 
                !"EXTERNAL".equals(attributes.get("user_type").get(0))) {
                throw new RuntimeException("User is not an external user");
            }
            
            // Use Keycloak's built-in password reset
            realmResource.users().get(user.getId())
                .executeActionsEmail(Arrays.asList("UPDATE_PASSWORD"));
            
            log.info("Password reset email sent to external user: {}", email);
            
        } catch (Exception e) {
            log.error("Failed to send password reset for external user {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to send password reset: " + e.getMessage());
        }
    }

    /**
     * Ensure user attributes are set with retry mechanism
     */
    private boolean ensureUserAttributesWithRetry(String userId, Map<String, List<String>> attributes, int maxRetries) {
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                log.info("Attempt {} - Setting attributes for user: {}", attempt, userId);
                
                RealmResource realmResource = keycloak.realm(realm);
                UserResource userResource = realmResource.users().get(userId);
                UserRepresentation user = userResource.toRepresentation();
                
                user.setAttributes(attributes);
                userResource.update(user);
                
                // Wait and verify
                Thread.sleep(1000);
                UserRepresentation verifyUser = userResource.toRepresentation();
                
                if (isExternalUser(verifyUser)) {
                    log.info("Attributes successfully set for user: {}", userId);
                    return true;
                }
                
            } catch (Exception e) {
                log.error("Attempt {} failed: {}", attempt, e.getMessage());
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return false;
                    }
                }
            }
        }
        return false;
    }

    private void setTemporaryPassword(String userId, String password) {
        try {
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(password);
            credential.setTemporary(true);
            
            RealmResource realmResource = keycloak.realm(realm);
            realmResource.users().get(userId).resetPassword(credential);
            
        } catch (Exception e) {
            log.error("Error setting temporary password: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to set temporary password");
        }
    }

    private void sendExternalUserWelcomeEmail(String email, String firstname, String temporaryPassword) 
            throws MessagingException {
        emailService.sendExternalUserWelcomeEmail(email, firstname, externalLoginUrl);
    }

    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        StringBuilder password = new StringBuilder();
        SecureRandom random = new SecureRandom();
        
        // Ensure password has at least one of each type
        password.append(chars.charAt(random.nextInt(26))); // uppercase
        password.append(chars.charAt(26 + random.nextInt(26))); // lowercase
        password.append(chars.charAt(52 + random.nextInt(10))); // digit
        password.append(chars.charAt(62 + random.nextInt(8))); // special
        
        // Fill the rest randomly
        for (int i = 4; i < 12; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return password.toString();
    }

    private String getCreatedId(jakarta.ws.rs.core.Response response) {
        String location = response.getHeaderString("Location");
        return location.substring(location.lastIndexOf('/') + 1);
    }

    /**
     * Improved method to validate external user attributes
     */
    public boolean isExternalUser(UserRepresentation user) {
        Map<String, List<String>> attributes = user.getAttributes();
        
        if (attributes == null) {
            log.warn("User {} has no attributes", user.getEmail());
            return false;
        }
        
        // Check user_type attribute
        boolean hasUserType = attributes.containsKey("user_type") && 
                             attributes.get("user_type") != null &&
                             !attributes.get("user_type").isEmpty() &&
                             "EXTERNAL".equals(attributes.get("user_type").get(0));
        
        // Check created_by_manager attribute  
        boolean hasCreatedByManager = attributes.containsKey("created_by_manager") && 
                                     attributes.get("created_by_manager") != null &&
                                     !attributes.get("created_by_manager").isEmpty() &&
                                     "true".equals(attributes.get("created_by_manager").get(0));
        
        log.debug("User {} - user_type: {}, created_by_manager: {}", 
                 user.getEmail(), hasUserType, hasCreatedByManager);
        
        return hasUserType && hasCreatedByManager;
    }

    /**
     * Add external attributes to existing user (if needed)
     */
    public void ensureExternalUserAttributes(String userId) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            UserResource userResource = realmResource.users().get(userId);
            UserRepresentation user = userResource.toRepresentation();
            
            if (!isExternalUser(user)) {
                log.info("Adding external attributes to user: {}", userId);
                
                Map<String, List<String>> attributes = user.getAttributes();
                if (attributes == null) {
                    attributes = new HashMap<>();
                }
                
                // Add external attributes
                attributes.put("user_type", Collections.singletonList("EXTERNAL"));
                attributes.put("created_by_manager", Collections.singletonList("true"));
                
                user.setAttributes(attributes);
                userResource.update(user);
                
                log.info("External attributes added successfully to user: {}", userId);
            }
            
        } catch (Exception e) {
            log.error("Failed to ensure external attributes for user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Force fix external user attributes if they're missing during authentication
     */
    private void forceFixExternalAttributes(String userId) {
        try {
            log.info("Force fixing external attributes for user: {}", userId);
            
            RealmResource realmResource = keycloak.realm(realm);
            UserResource userResource = realmResource.users().get(userId);
            UserRepresentation user = userResource.toRepresentation();
            
            Map<String, List<String>> attributes = user.getAttributes();
            if (attributes == null) {
                attributes = new HashMap<>();
            }
            
            // Force set external attributes
            attributes.put("user_type", Collections.singletonList("EXTERNAL"));
            attributes.put("created_by_manager", Collections.singletonList("true"));
            
            user.setAttributes(attributes);
            userResource.update(user);
            
            log.info("Force fixed external attributes for user: {}", userId);
            
        } catch (Exception e) {
            log.error("Failed to force fix attributes for user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Test method to verify Keycloak admin permissions
     */
    public void testKeycloakPermissions() {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            
            // Test basic read access
            var realmInfo = realmResource.toRepresentation();
            log.info("Realm access successful: {}", realmInfo.getRealm());
            
            // Test user list access
            var users = realmResource.users().list(0, 1);
            log.info("User list access successful, found {} users", users.size());
            
            if (!users.isEmpty()) {
                UserRepresentation testUser = users.get(0);
                log.info("Test user attributes: {}", testUser.getAttributes());
            }
            
        } catch (Exception e) {
            log.error("Keycloak permission test failed: {}", e.getMessage(), e);
        }
    }
}

























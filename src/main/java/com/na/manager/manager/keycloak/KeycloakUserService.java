package com.na.manager.manager.keycloak;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import jakarta.ws.rs.core.Response;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserService {

    private final Keycloak keycloak; // Use the bean from KeycloakConfig
    
    @Value("${keycloak.realm}")
    private String realm; // This is "manager-realm" for operations

    public String createUser(KeycloakUserDTO userDTO) {
        log.info("Creating user with email: {}", userDTO.getEmail());
        
        try {
            // Check if user already exists first
            RealmResource realmResource = keycloak.realm(realm);
            List<UserRepresentation> existingUsers = realmResource.users()
                .search(userDTO.getEmail(), 0, 1);
            
            if (!existingUsers.isEmpty()) {
                throw new DataIntegrityViolationException("User with email " + userDTO.getEmail() + " already exists in Keycloak");
            }
            
            // Create user representation
            UserRepresentation user = new UserRepresentation();
            user.setEnabled(userDTO.isEnabled());
            user.setUsername(userDTO.getEmail());
            user.setFirstName(userDTO.getFirstname());
            user.setLastName(userDTO.getLastname());
            user.setEmail(userDTO.getEmail());
            user.setEmailVerified(false);
            
            // Set user attributes if needed
            Map<String, List<String>> attributes = new HashMap<>();
            if (userDTO.getBirthdate() != null) {
                attributes.put("birthdate", Collections.singletonList(userDTO.getBirthdate().toString()));
            }
            user.setAttributes(attributes);

            // Use the same realmResource (don't redeclare)
            UsersResource usersResource = realmResource.users();

            // Create user (returns a response)
            Response response = usersResource.create(user);
            
            if (response.getStatus() == 201) {
                // Get the user ID from the response URL
                String userId = getCreatedId(response);
                log.info("User created successfully with ID: {}", userId);
                
                // Set password if provided
                if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                    setUserPassword(userId, userDTO.getPassword());
                }
                
                // Assign default USER role
                try {
                    assignRolesToUser(userId, Collections.singletonList("USER"));
                } catch (Exception e) {
                    log.warn("Failed to assign role to user {}: {}", userId, e.getMessage());
                }
                
                return userId;
            } else if (response.getStatus() == 409) {
                throw new DataIntegrityViolationException("User with email " + userDTO.getEmail() + " already exists in Keycloak");
            } else {
                String errorMsg = "Failed to create user in Keycloak. Status: " + response.getStatus();
                log.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }
        } catch (DataIntegrityViolationException e) {
            throw e; // Re-throw to be handled by GlobalExceptionHandler
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create user: " + e.getMessage());
        }
    }

    /**
     * Update an existing user in Keycloak
     */
    public void updateUser(String userId, KeycloakUserDTO userDTO) {
        log.info("Updating user with ID: {}", userId);
        
        try {
            RealmResource realmResource = keycloak.realm(realm); // Use manager-realm for operations
            UserResource userResource = realmResource.users().get(userId);
            
            UserRepresentation user = userResource.toRepresentation();
            user.setFirstName(userDTO.getFirstname());
            user.setLastName(userDTO.getLastname());
            user.setEmail(userDTO.getEmail());
            user.setUsername(userDTO.getEmail());
            user.setEnabled(userDTO.isEnabled());
            
            // Update attributes if needed
            Map<String, List<String>> attributes = user.getAttributes();
            if (attributes == null) {
                attributes = new HashMap<>();
            }
            if (userDTO.getBirthdate() != null) {
                attributes.put("birthdate", Collections.singletonList(userDTO.getBirthdate().toString()));
            }
            user.setAttributes(attributes);
            
            userResource.update(user);
            log.info("User updated successfully");
            
            // Update password if provided
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                setUserPassword(userId, userDTO.getPassword());
            }
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update user: " + e.getMessage());
        }
    }

    /**
     * Enable or disable a user in Keycloak
     */
    public void setUserEnabled(String userId, boolean enabled) {
        log.info("Setting user {} enabled status to: {}", userId, enabled);
        
        try {
            RealmResource realmResource = keycloak.realm(realm); // Use manager-realm for operations
            UserResource userResource = realmResource.users().get(userId);
            
            UserRepresentation user = userResource.toRepresentation();
            user.setEnabled(enabled);
            
            userResource.update(user);
            log.info("User enabled status updated successfully");
        } catch (Exception e) {
            log.error("Error updating user enabled status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update user status: " + e.getMessage());
        }
    }

    /**
     * Get all users from Keycloak
     */
    public List<UserRepresentation> getAllUsers() {
        log.info("Fetching all users");
        try {
            RealmResource realmResource = keycloak.realm(realm); // Use manager-realm for operations
            return realmResource.users().list();
        } catch (Exception e) {
            log.error("Error fetching all users: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch users: " + e.getMessage());
        }
    }

    /**
     * Get a user by ID from Keycloak
     */
    public UserRepresentation getUserById(String userId) {
        log.info("Fetching user with ID: {}", userId);
        try {
            RealmResource realmResource = keycloak.realm(realm); // Use manager-realm for operations
            return realmResource.users().get(userId).toRepresentation();
        } catch (Exception e) {
            log.error("Error fetching user by ID: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch user: " + e.getMessage());
        }
    }

    /**
     * Search for users by email or username
     */
    public List<UserRepresentation> searchUsers(String search) {
        log.info("Searching users with query: {}", search);
        try {
            RealmResource realmResource = keycloak.realm(realm); // Use manager-realm for operations
            return realmResource.users().search(search, 0, 100);
        } catch (Exception e) {
            log.error("Error searching users: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to search users: " + e.getMessage());
        }
    }

    /**
     * Delete a user from Keycloak
     */
    public void deleteUser(String userId) {
        log.info("Deleting user with ID: {}", userId);
        try {
            RealmResource realmResource = keycloak.realm(realm); // Use manager-realm for operations
            realmResource.users().get(userId).remove();
            log.info("User deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete user: " + e.getMessage());
        }
    }

    /**
     * Set a password for a user
     */
    private void setUserPassword(String userId, String password) {
        log.info("Setting password for user: {}", userId);
        try {
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(password);
            credential.setTemporary(false);
            
            RealmResource realmResource = keycloak.realm(realm); // Use manager-realm for operations
            realmResource.users().get(userId).resetPassword(credential);
            log.info("Password set successfully");
        } catch (Exception e) {
            log.error("Error setting user password: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to set password: " + e.getMessage());
        }
    }

    /**
     * Assign roles to a user
     */
    private void assignRolesToUser(String userId, List<String> roleNames) {
        log.info("Assigning roles {} to user: {}", roleNames, userId);
        try {
            RealmResource realmResource = keycloak.realm(realm); // Use manager-realm for operations
            
            // Get user
            UserResource userResource = realmResource.users().get(userId);
            
            // Get realm roles that exist
            List<RoleRepresentation> rolesToAdd = roleNames.stream()
                    .map(roleName -> {
                        try {
                            return realmResource.roles().get(roleName).toRepresentation();
                        } catch (Exception e) {
                            log.warn("Role {} does not exist in realm {}", roleName, realm);
                            return null;
                        }
                    })
                    .filter(role -> role != null)
                    .toList();
            
            if (!rolesToAdd.isEmpty()) {
                // Assign realm roles to user
                userResource.roles().realmLevel().add(rolesToAdd);
                log.info("Roles assigned successfully");
            } else {
                log.warn("No valid roles found to assign to user {}", userId);
            }
        } catch (Exception e) {
            log.error("Error assigning roles to user: {}", e.getMessage(), e);
            // Don't throw exception here, as user creation should succeed even if role assignment fails
        }
    }

    /**
     * Extract the user ID from the response
     */
    private String getCreatedId(Response response) {
        String location = response.getHeaderString("Location");
        if (location != null) {
            return location.replaceAll(".*/([^/]+)$", "$1");
        }
        return null;
    }
}





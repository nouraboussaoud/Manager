package com.na.manager.manager.keycloak;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/keycloak/users")
@RequiredArgsConstructor
@Tag(name = "Keycloak User Management", description = "External user management through Keycloak")
@Slf4j
public class KeycloakUserController {

    private final KeycloakUserService keycloakUserService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Create new user in Keycloak")
    public ResponseEntity<ApiResponse<String>> createUser(@RequestBody @Valid KeycloakUserDTO userDTO) {
        log.info("Creating user with email: {}", userDTO.getEmail());
        try {
            String userId = keycloakUserService.createUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User created successfully", userId));
        } catch (Exception e) {
            log.error("Failed to create user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create user: " + e.getMessage()));
        }
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Update existing user in Keycloak")
    public ResponseEntity<ApiResponse<Void>> updateUser(
            @PathVariable String userId,
            @RequestBody @Valid KeycloakUserDTO userDTO) {
        log.info("Updating user with ID: {}", userId);
        try {
            keycloakUserService.updateUser(userId, userDTO);
            return ResponseEntity.ok(ApiResponse.success("User updated successfully", null));
        } catch (Exception e) {
            log.error("Failed to update user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update user: " + e.getMessage()));
        }
    }

    @PutMapping("/{userId}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Enable or disable user in Keycloak")
    public ResponseEntity<ApiResponse<Void>> setUserStatus(
            @PathVariable String userId,
            @RequestParam boolean enabled) {
        log.info("Setting user {} enabled status to: {}", userId, enabled);
        try {
            keycloakUserService.setUserEnabled(userId, enabled);
            return ResponseEntity.ok(ApiResponse.success(
                    "User " + (enabled ? "enabled" : "disabled") + " successfully", null));
        } catch (Exception e) {
            log.error("Failed to update user status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update user status: " + e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Get all users from Keycloak")
    public ResponseEntity<ApiResponse<List<KeycloakUserDTO>>> getAllUsers() {
        log.info("Fetching all users from Keycloak");
        try {
            List<KeycloakUserDTO> users = keycloakUserService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (Exception e) {
            log.error("Failed to fetch users: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch users: " + e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Get user by ID from Keycloak")
    public ResponseEntity<ApiResponse<KeycloakUserDTO>> getUserById(@PathVariable String userId) {
        log.info("Fetching user with ID: {}", userId);
        try {
            KeycloakUserDTO user = keycloakUserService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
        } catch (Exception e) {
            log.error("Failed to fetch user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Failed to fetch user: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Search users in Keycloak")
    public ResponseEntity<ApiResponse<List<KeycloakUserDTO>>> searchUsers(@RequestParam String query) {
        log.info("Searching users with query: {}", query);
        try {
            List<KeycloakUserDTO> users = keycloakUserService.searchUsers(query);
            return ResponseEntity.ok(ApiResponse.success("Search completed successfully", users));
        } catch (Exception e) {
            log.error("Failed to search users: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to search users: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Delete user from Keycloak")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String userId) {
        log.info("Deleting user with ID: {}", userId);
        try {
            keycloakUserService.deleteUser(userId);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
        } catch (Exception e) {
            log.error("Failed to delete user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete user: " + e.getMessage()));
        }
    }


    // Helper class for consistent API responses
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        public static <T> ApiResponse<T> success(String message, T data) {
            return new ApiResponse<>(true, message, data);
        }

        public static <T> ApiResponse<T> error(String message) {
            return new ApiResponse<>(false, message, null);
        }

        // Getters
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public T getData() { return data; }
    }
}
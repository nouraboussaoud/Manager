package com.na.manager.manager.user;

import com.na.manager.manager.keycloak.KeycloakUserService;
import com.na.manager.manager.keycloak.KeycloakUserDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final KeycloakUserService keycloakUserService;
    private final UserRepository userRepository;
    
    @GetMapping
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<List<KeycloakUserDTO>> getAllUsers() {
        return ResponseEntity.ok(keycloakUserService.getAllUsers());
    }
    
    @PostMapping
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<String> createUser(@RequestBody @Valid KeycloakUserDTO userDTO) {
        String userId = keycloakUserService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(userId);
    }
    
    @PutMapping("/{userId}")
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<Void> updateUser(
            @PathVariable String userId,
            @RequestBody @Valid KeycloakUserDTO userDTO) {
        keycloakUserService.updateUser(userId, userDTO);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{userId}/status")
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<Void> setUserStatus(
            @PathVariable String userId,
            @RequestParam boolean enabled) {
        keycloakUserService.setUserEnabled(userId, enabled);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{userId}")
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<KeycloakUserDTO> getUserById(@PathVariable String userId) {
        return ResponseEntity.ok(keycloakUserService.getUserById(userId));
    }

    @GetMapping("/search")
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<List<KeycloakUserDTO>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(keycloakUserService.searchUsers(query));
    }
    
    @DeleteMapping("/{userId}")
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        keycloakUserService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<KeycloakUserDTO> getCurrentUser() {
        log.info("Fetching current internal database user profile");
        try {
            // Get the current authenticated user's email from SecurityContext
            String currentUserEmail = SecurityContextHolder.getContext()
                    .getAuthentication().getName();
            
            log.info("Current authenticated user email: {}", currentUserEmail);
            
            // If user is anonymous, try to get a default user for testing
            if ("anonymousUser".equals(currentUserEmail)) {
                log.info("Anonymous user detected, looking for user with email: nour.aboussaoud@esprit.tn");
                currentUserEmail = "nour.aboussaoud@esprit.tn";
            }
            
            // Find the user by email in internal database
            User currentUser = userRepository.findByEmail(currentUserEmail)
                    .orElse(null);
            
            if (currentUser != null) {
                log.info("Found current internal user: {} {}", currentUser.getFirstname(), currentUser.getLastname());
                
                // Convert internal User to KeycloakUserDTO for frontend consistency
                KeycloakUserDTO userDTO = KeycloakUserDTO.builder()
                        .id(String.valueOf(currentUser.getId()))
                        .firstname(currentUser.getFirstname())
                        .lastname(currentUser.getLastname())
                        .email(currentUser.getEmail())
                        .enabled(currentUser.isEnabled())
                        .build();
                
                return ResponseEntity.ok(userDTO);
            } else {
                log.warn("Current user not found in internal database with email: {}", currentUserEmail);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            log.error("Failed to fetch current internal user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}




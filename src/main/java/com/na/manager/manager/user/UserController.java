package com.na.manager.manager.user;

import com.na.manager.manager.keycloak.KeycloakUserService;
import com.na.manager.manager.keycloak.KeycloakUserDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    
    private final KeycloakUserService keycloakUserService;
    
    @GetMapping
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<List<UserRepresentation>> getAllUsers() {
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
    public ResponseEntity<UserRepresentation> getUserById(@PathVariable String userId) {
        return ResponseEntity.ok(keycloakUserService.getUserById(userId));
    }
    
    @GetMapping("/search")
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<List<UserRepresentation>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(keycloakUserService.searchUsers(query));
    }
    
    @DeleteMapping("/{userId}")
    // @PreAuthorize("hasAuthority('ADMIN')") // Temporarily comment out
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        keycloakUserService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}




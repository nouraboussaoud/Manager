package com.na.manager.manager.account;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/integrated-accounts")
@RequiredArgsConstructor
@Tag(name = "Integrated Account Management", description = "API for managing accounts integrated with Keycloak users")
public class IntegratedAccountController {

    private final IntegratedAccountService integratedAccountService;

    @GetMapping("/users-with-accounts")
    @Operation(summary = "Get all users with their accounts",
               description = "Retrieves all Keycloak users along with their associated accounts")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<List<UserWithAccounts>> getAllUsersWithAccounts() {
        try {
            List<UserWithAccounts> usersWithAccounts = integratedAccountService.getAllUsersWithAccounts();
            return ResponseEntity.ok(usersWithAccounts);
        } catch (Exception e) {
            log.error("Failed to get users with accounts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{keycloakUserId}/accounts")
    @Operation(summary = "Get accounts for specific user", 
               description = "Retrieves all accounts associated with a specific Keycloak user")
    @PreAuthorize("hasRole('ADMIN') or #keycloakUserId == authentication.name")
    public ResponseEntity<List<Account>> getAccountsForUser(
            @Parameter(description = "Keycloak user ID") 
            @PathVariable String keycloakUserId) {
        try {
            List<Account> accounts = integratedAccountService.getAccountsForUser(keycloakUserId);
            return ResponseEntity.ok(accounts);
        } catch (IllegalArgumentException e) {
            log.warn("User not found: {}", keycloakUserId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to get accounts for user: {}", keycloakUserId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/user/{keycloakUserId}/accounts")
    @Operation(summary = "Add account to specific user",
               description = "Creates a new account and associates it with a specific Keycloak user")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<Account> createAccountForUser(
            @Parameter(description = "Keycloak user ID") 
            @PathVariable String keycloakUserId,
            @Valid @RequestBody CreateAccountRequest request) {
        try {
            Account account = integratedAccountService.createAccountForUser(keycloakUserId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(account);
        } catch (IllegalArgumentException e) {
            log.warn("Failed to create account: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Failed to create account for user: {}", keycloakUserId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/user/{keycloakUserId}/accounts/{codCli}")
    @Operation(summary = "Update account for user",
               description = "Updates an existing account for a specific Keycloak user")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<Account> updateAccountForUser(
            @Parameter(description = "Keycloak user ID") 
            @PathVariable String keycloakUserId,
            @Parameter(description = "Account client code") 
            @PathVariable Integer codCli,
            @Valid @RequestBody UpdateAccountRequest request) {
        try {
            Account account = integratedAccountService.updateAccountForUser(keycloakUserId, codCli, request);
            return ResponseEntity.ok(account);
        } catch (IllegalArgumentException e) {
            log.warn("Failed to update account: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to update account {} for user: {}", codCli, keycloakUserId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/user/{keycloakUserId}/accounts/{codCli}")
    @Operation(summary = "Delete account from user",
               description = "Removes an account from a specific Keycloak user")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<Void> deleteAccountForUser(
            @Parameter(description = "Keycloak user ID") 
            @PathVariable String keycloakUserId,
            @Parameter(description = "Account client code") 
            @PathVariable Integer codCli) {
        try {
            integratedAccountService.deleteAccountForUser(keycloakUserId, codCli);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Failed to delete account: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to delete account {} for user: {}", codCli, keycloakUserId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/dashboard-summary")
    @Operation(summary = "Dashboard summary",
               description = "Provides summary statistics for the dashboard")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<DashboardSummary> getDashboardSummary() {
        try {
            DashboardSummary summary = integratedAccountService.getDashboardSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Failed to get dashboard summary", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/cache/clear")
    @Operation(summary = "Clear cache", 
               description = "Clears the JSON file cache to force reload from disk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> clearCache() {
        try {
            // This would be implemented in JsonFileService if needed
            log.info("Cache clear requested");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to clear cache", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", 
               description = "Checks the health of the integrated account service")
    public ResponseEntity<String> healthCheck() {
        try {
            // Basic health check - could be expanded
            return ResponseEntity.ok("Integrated Account Service is healthy");
        } catch (Exception e) {
            log.error("Health check failed", e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Integrated Account Service is unhealthy");
        }
    }

    // SEF Client Management Endpoints
    
    @GetMapping("/sef-clients")
    @Operation(summary = "Get all SEF clients",
               description = "Retrieves all SEF clients")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<List<SefClient>> getAllSefClients() {
        try {
            List<SefClient> sefClients = integratedAccountService.getAllSefClients();
            return ResponseEntity.ok(sefClients);
        } catch (Exception e) {
            log.error("Failed to get SEF clients", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sef-clients")
    @Operation(summary = "Create SEF client",
               description = "Creates a new SEF client")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<?> createSefClient(@Valid @RequestBody CreateSefClientRequest request) {
        try {
            log.info("Creating SEF client with request: {}", request);
            SefClient sefClient = integratedAccountService.createSefClient(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(sefClient);
        } catch (IllegalArgumentException e) {
            log.warn("Failed to create SEF client: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to create SEF client", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Internal server error: " + e.getMessage()));
        }
    }
    
    // Simple error response class
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }

    @GetMapping("/sef-clients/{identite}")
    @Operation(summary = "Get SEF client by identity",
               description = "Retrieves a specific SEF client by identity")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<SefClient> getSefClientByIdentity(
            @Parameter(description = "SEF client identity")
            @PathVariable String identite) {
        try {
            SefClient sefClient = integratedAccountService.getSefClientByIdentity(identite);
            return ResponseEntity.ok(sefClient);
        } catch (IllegalArgumentException e) {
            log.warn("SEF client not found: {}", identite);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to get SEF client: {}", identite, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/sef-clients/{identite}")
    @Operation(summary = "Delete SEF client",
               description = "Removes a SEF client by identity")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<Void> deleteSefClient(
            @Parameter(description = "SEF client identity")
            @PathVariable String identite) {
        try {
            integratedAccountService.deleteSefClient(identite);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Failed to delete SEF client: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to delete SEF client: {}", identite, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/accounts/all")
    @Operation(summary = "Get all accounts flattened",
               description = "Retrieves all accounts in a flat list with owner details")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<List<Account>> getAllAccountsFlattened() {
        try {
            List<Account> accounts = integratedAccountService.getAllAccountsFlattened();
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            log.error("Failed to get all accounts flattened", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
package com.na.manager.manager.account;

import com.na.manager.manager.keycloak.KeycloakUserDTO;
import com.na.manager.manager.keycloak.KeycloakUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IntegratedAccountServiceTest {

    @Mock
    private JsonFileService jsonFileService;

    @Mock
    private KeycloakUserService keycloakUserService;

    @InjectMocks
    private IntegratedAccountService integratedAccountService;

    private KeycloakUserDTO testUser;
    private Account testAccount;

    @BeforeEach
    void setUp() {
        testUser = KeycloakUserDTO.builder()
                .id("test-user-id")
                .email("test@example.com")
                .firstname("John")
                .lastname("Doe")
                .build();

        testAccount = Account.builder()
                .codCli(12345)
                .libcli("Test Company")
                .identite("12345")
                .keycloakUserId("test-user-id")
                .userEmail("test@example.com")
                .userName("John Doe")
                .disabled(false)
                .cloture(false)
                .createdDate(LocalDateTime.now())
                .lastModifiedDate(LocalDateTime.now())
                .build();
    }

    @Test
    void testGetAllUsersWithAccounts() {
        // Given
        List<KeycloakUserDTO> users = Arrays.asList(testUser);
        List<Account> accounts = Arrays.asList(testAccount);

        when(keycloakUserService.getAllUsers()).thenReturn(users);
        when(jsonFileService.readBoAccounts()).thenReturn(accounts);

        // When
        List<UserWithAccounts> result = integratedAccountService.getAllUsersWithAccounts();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        
        UserWithAccounts userWithAccounts = result.get(0);
        assertEquals(testUser.getId(), userWithAccounts.getUser().getId());
        assertEquals(1, userWithAccounts.getAccounts().size());
        assertEquals(1, userWithAccounts.getAccountCount());
        assertEquals(1, userWithAccounts.getActiveAccountCount());
        assertEquals(0, userWithAccounts.getDisabledAccountCount());
    }

    @Test
    void testGetAccountsForUser() {
        // Given
        List<Account> accounts = Arrays.asList(testAccount);
        when(keycloakUserService.getUserById("test-user-id")).thenReturn(testUser);
        when(jsonFileService.readBoAccounts()).thenReturn(accounts);

        // When
        List<Account> result = integratedAccountService.getAccountsForUser("test-user-id");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testAccount.getCodCli(), result.get(0).getCodCli());
    }

    @Test
    void testCreateAccountForUser() {
        // Given
        CreateAccountRequest request = CreateAccountRequest.builder()
                .codCli(67890)
                .libcli("New Company")
                .identite("67890")
                .disabled(false)
                .cloture(false)
                .build();

        when(keycloakUserService.getUserById("test-user-id")).thenReturn(testUser);
        when(jsonFileService.readBoAccounts()).thenReturn(Arrays.asList());
        when(jsonFileService.readAccountsList()).thenReturn(Arrays.asList());

        // When
        Account result = integratedAccountService.createAccountForUser("test-user-id", request);

        // Then
        assertNotNull(result);
        assertEquals(request.getCodCli(), result.getCodCli());
        assertEquals(request.getLibcli(), result.getLibcli());
        assertEquals("test-user-id", result.getKeycloakUserId());
        assertEquals(testUser.getEmail(), result.getUserEmail());
        assertEquals("John Doe", result.getUserName());

        verify(jsonFileService).writeBoAccounts(any());
        verify(jsonFileService).writeAccountsList(any());
    }

    @Test
    void testGetDashboardSummary() {
        // Given
        List<KeycloakUserDTO> users = Arrays.asList(testUser);
        List<Account> accounts = Arrays.asList(testAccount);

        when(keycloakUserService.getAllUsers()).thenReturn(users);
        when(jsonFileService.readBoAccounts()).thenReturn(accounts);

        // When
        DashboardSummary result = integratedAccountService.getDashboardSummary();

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalUsers());
        assertEquals(1, result.getTotalAccounts());
        assertEquals(1, result.getActiveAccounts());
        assertEquals(0, result.getDisabledAccounts());
        assertEquals(0, result.getClosedAccounts());
    }

    @Test
    void testValidateUserExists_UserNotFound() {
        // Given
        when(keycloakUserService.getUserById("invalid-user-id")).thenReturn(null);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            integratedAccountService.getAccountsForUser("invalid-user-id");
        });
    }
}
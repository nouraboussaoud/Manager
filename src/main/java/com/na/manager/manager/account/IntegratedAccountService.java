package com.na.manager.manager.account;

import com.na.manager.manager.keycloak.KeycloakUserDTO;
import com.na.manager.manager.keycloak.KeycloakUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IntegratedAccountService {

    private final JsonFileService jsonFileService;
    private final KeycloakUserService keycloakUserService;

    public List<UserWithAccounts> getAllUsersWithAccounts() {
        List<KeycloakUserDTO> users = keycloakUserService.getAllUsers();
        List<Account> allAccounts = jsonFileService.readBoAccounts();

        return users.stream()
                .map(user -> {
                    List<Account> userAccounts = allAccounts.stream()
                            .filter(account -> user.getId().equals(account.getKeycloakUserId()))
                            .collect(Collectors.toList());

                    return UserWithAccounts.builder()
                            .user(user)
                            .accounts(userAccounts)
                            .accountCount(userAccounts.size())
                            .activeAccountCount((int) userAccounts.stream()
                                    .filter(account -> !Boolean.TRUE.equals(account.getDisabled()))
                                    .count())
                            .disabledAccountCount((int) userAccounts.stream()
                                    .filter(account -> Boolean.TRUE.equals(account.getDisabled()))
                                    .count())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<Account> getAccountsForUser(String keycloakUserId) {
        try {
            validateUserExists(keycloakUserId);
        } catch (Exception e) {
            log.warn("User validation failed for {}: {}", keycloakUserId, e.getMessage());
            // Return empty list if user doesn't exist or validation fails
            return List.of();
        }
        
        List<Account> allAccounts = jsonFileService.readBoAccounts();
        return allAccounts.stream()
                .filter(account -> keycloakUserId.equals(account.getKeycloakUserId()))
                .collect(Collectors.toList());
    }

    public Account createAccountForUser(String keycloakUserId, CreateAccountRequest request) {
        KeycloakUserDTO user = validateUserExists(keycloakUserId);
        
        List<Account> accounts = jsonFileService.readBoAccounts();
        
        // Check if account with same cod_cli already exists
        boolean accountExists = accounts.stream()
                .anyMatch(account -> account.getCodCli().equals(request.getCodCli()));
        
        if (accountExists) {
            throw new IllegalArgumentException("Account with code " + request.getCodCli() + " already exists");
        }

        Account newAccount = Account.builder()
                .codCli(request.getCodCli())
                .libcli(request.getLibcli())
                .identite(request.getIdentite())
                .trade(request.getTrade())
                .adress(request.getAdress())
                .indSociete(request.getIndSociete())
                .chefFile(request.getChefFile())
                .cloture(request.getCloture())
                .disabled(request.getDisabled())
                .keycloakUserId(keycloakUserId)
                .userEmail(user.getEmail())
                .userName(user.getFirstname() + " " + user.getLastname())
                .createdDate(LocalDateTime.now())
                .lastModifiedDate(LocalDateTime.now())
                .localcli(request.getLocalcli())
                .build();

        // Set timestamps for localcli if provided
        if (newAccount.getLocalcli() != null) {
            newAccount.getLocalcli().setCreatedDate(LocalDateTime.now());
            newAccount.getLocalcli().setLastModifiedDate(LocalDateTime.now());
        }

        accounts.add(newAccount);
        jsonFileService.writeBoAccounts(accounts);
        
        // Also update accounts-list.json
        List<Account> accountsList = jsonFileService.readAccountsList();
        accountsList.add(newAccount);
        jsonFileService.writeAccountsList(accountsList);

        log.info("Created account {} for user {}", newAccount.getCodCli(), keycloakUserId);
        return newAccount;
    }

    public Account updateAccountForUser(String keycloakUserId, Integer codCli, UpdateAccountRequest request) {
        validateUserExists(keycloakUserId);
        
        List<Account> accounts = jsonFileService.readBoAccounts();
        
        Optional<Account> accountOpt = accounts.stream()
                .filter(account -> account.getCodCli().equals(codCli) &&
                                 keycloakUserId.equals(account.getKeycloakUserId()))
                .findFirst();

        if (accountOpt.isEmpty()) {
            throw new IllegalArgumentException("Account not found for user");
        }

        Account account = accountOpt.get();
        
        // Check if new cod_cli conflicts with existing accounts (if being changed)
        if (request.getCodCli() != null && !request.getCodCli().equals(codCli)) {
            boolean codeExists = accounts.stream()
                    .anyMatch(acc -> acc.getCodCli().equals(request.getCodCli()) &&
                                   !acc.getCodCli().equals(codCli));
            if (codeExists) {
                throw new IllegalArgumentException("Account with code " + request.getCodCli() + " already exists");
            }
            account.setCodCli(request.getCodCli());
        }
        
        // Update fields if provided
        if (request.getLibcli() != null) account.setLibcli(request.getLibcli());
        if (request.getIdentite() != null) account.setIdentite(request.getIdentite());
        if (request.getTrade() != null) account.setTrade(request.getTrade());
        if (request.getAdress() != null) account.setAdress(request.getAdress());
        if (request.getIndSociete() != null) account.setIndSociete(request.getIndSociete());
        if (request.getChefFile() != null) account.setChefFile(request.getChefFile());
        if (request.getCloture() != null) account.setCloture(request.getCloture());
        if (request.getDisabled() != null) account.setDisabled(request.getDisabled());
        if (request.getLocalcli() != null) {
            account.setLocalcli(request.getLocalcli());
            account.getLocalcli().setLastModifiedDate(LocalDateTime.now());
        }
        
        account.setLastModifiedDate(LocalDateTime.now());

        jsonFileService.writeBoAccounts(accounts);
        
        // Also update accounts-list.json
        List<Account> accountsList = jsonFileService.readAccountsList();
        accountsList.removeIf(acc -> acc.getCodCli().equals(codCli) ||
                                   (request.getCodCli() != null && acc.getCodCli().equals(request.getCodCli())));
        accountsList.add(account);
        jsonFileService.writeAccountsList(accountsList);

        log.info("Updated account {} for user {}", account.getCodCli(), keycloakUserId);
        return account;
    }

    public void deleteAccountForUser(String keycloakUserId, Integer codCli) {
        validateUserExists(keycloakUserId);
        
        List<Account> accounts = jsonFileService.readBoAccounts();
        
        boolean removed = accounts.removeIf(account -> 
            account.getCodCli().equals(codCli) && keycloakUserId.equals(account.getKeycloakUserId()));

        if (!removed) {
            throw new IllegalArgumentException("Account not found for user");
        }

        jsonFileService.writeBoAccounts(accounts);
        
        // Also update accounts-list.json
        List<Account> accountsList = jsonFileService.readAccountsList();
        accountsList.removeIf(acc -> acc.getCodCli().equals(codCli));
        jsonFileService.writeAccountsList(accountsList);

        log.info("Deleted account {} for user {}", codCli, keycloakUserId);
    }

    public DashboardSummary getDashboardSummary() {
        List<KeycloakUserDTO> users = keycloakUserService.getAllUsers();
        List<Account> accounts = jsonFileService.readBoAccounts();

        // Calculate user statistics
        long totalUsers = users.size();
        long activeUsers = users.stream()
                .filter(user -> user.isEnabled())
                .count();
        long pendingUsers = users.stream()
                .filter(user -> !user.isEnabled())
                .count();
        long blockedUsers = 0; // For now, we'll consider all non-enabled users as pending

        // Calculate account statistics
        long activeAccounts = accounts.stream()
                .filter(account -> !Boolean.TRUE.equals(account.getDisabled()) &&
                                 !Boolean.TRUE.equals(account.getCloture()))
                .count();

        long disabledAccounts = accounts.stream()
                .filter(account -> Boolean.TRUE.equals(account.getDisabled()))
                .count();

        long closedAccounts = accounts.stream()
                .filter(account -> Boolean.TRUE.equals(account.getCloture()))
                .count();

        long accountsWithTrade = accounts.stream()
                .filter(account -> account.getTrade() != null && account.getTrade() > 0)
                .count();

        long accountsWithTradeQB = accounts.stream()
                .filter(account -> account.getLocalcli() != null &&
                                 Boolean.TRUE.equals(account.getLocalcli().getTradeQB()))
                .count();

        return DashboardSummary.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .pendingUsers(pendingUsers)
                .blockedUsers(blockedUsers)
                .totalAccounts(accounts.size())
                .activeAccounts(activeAccounts)
                .disabledAccounts(disabledAccounts)
                .closedAccounts(closedAccounts)
                .accountsWithTrade(accountsWithTrade)
                .accountsWithTradeQB(accountsWithTradeQB)
                .build();
    }

    // SEF Client Management Methods
    
    public List<SefClient> getAllSefClients() {
        return jsonFileService.readSefClientsAsSefClient();
    }
    
    public SefClient createSefClient(CreateSefClientRequest request) {
        List<SefClient> sefClients = jsonFileService.readSefClientsAsSefClient();
        
        // Check if SEF client with same identity already exists
        boolean clientExists = sefClients.stream()
                .anyMatch(client -> client.getIdentite().equals(request.getIdentite()));
        
        if (clientExists) {
            throw new IllegalArgumentException("SEF client with identity " + request.getIdentite() + " already exists");
        }
        
        SefClient newSefClient = SefClient.builder()
                .identite(request.getIdentite())
                .natPid(request.getNatPid())
                .pwd(request.getPwd()) // In production, this should be hashed
                .libelle(request.getLibelle())
                .adresse(request.getAdresse())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .tradeQB(request.getTradeQB())
                .keycloakUserId(request.getKeycloakUserId())
                .lastPwdChange(LocalDateTime.now())
                .createdDate(LocalDateTime.now())
                .lastModifiedDate(LocalDateTime.now())
                .build();
        
        sefClients.add(newSefClient);
        jsonFileService.writeSefClientsAsSefClient(sefClients);
        
        log.info("Created SEF client {} with identity {}", newSefClient.getLibelle(), newSefClient.getIdentite());
        return newSefClient;
    }
    
    public void deleteSefClient(String identite) {
        List<SefClient> sefClients = jsonFileService.readSefClientsAsSefClient();
        
        boolean removed = sefClients.removeIf(client -> client.getIdentite().equals(identite));
        
        if (!removed) {
            throw new IllegalArgumentException("SEF client not found with identity: " + identite);
        }
        
        jsonFileService.writeSefClientsAsSefClient(sefClients);
        log.info("Deleted SEF client with identity {}", identite);
    }
    
    public SefClient getSefClientByIdentity(String identite) {
        List<SefClient> sefClients = jsonFileService.readSefClientsAsSefClient();
        return sefClients.stream()
                .filter(client -> client.getIdentite().equals(identite))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("SEF client not found with identity: " + identite));
    }
    
    public List<Account> getAllAccountsFlattened() {
        List<Account> allAccounts = jsonFileService.readBoAccounts();
        List<KeycloakUserDTO> users = keycloakUserService.getAllUsers();
        
        // Enrich accounts with user details
        return allAccounts.stream()
                .map(account -> {
                    users.stream()
                            .filter(user -> user.getId().equals(account.getKeycloakUserId()))
                            .findFirst()
                            .ifPresent(user -> {
                                account.setUserEmail(user.getEmail());
                                account.setUserName(user.getFirstname() + " " + user.getLastname());
                            });
                    return account;
                })
                .collect(Collectors.toList());
    }

    private KeycloakUserDTO validateUserExists(String keycloakUserId) {
        try {
            KeycloakUserDTO user = keycloakUserService.getUserById(keycloakUserId);
            if (user == null) {
                throw new IllegalArgumentException("User not found: " + keycloakUserId);
            }
            return user;
        } catch (Exception e) {
            log.error("Failed to validate user: {}", keycloakUserId, e);
            throw new IllegalArgumentException("User not found: " + keycloakUserId);
        }
    }
}
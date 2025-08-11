import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LocalClient {
  identite: string;
  nat_pid: string;
  pwd: string;
  libelle: string;
  adresse: string;
  email: string;
  mobile: string;
  lastPwdChange: string;
  tradeQB: boolean;
  created_date?: string;
  last_modified_date?: string;
}

export interface Account {
  cod_cli: number;
  libcli: string;
  identite: string;
  trade?: number;
  adress: string;
  ind_societe: string;
  chef_file: string;
  cloture: boolean;
  disabled: boolean;
  keycloak_user_id: string;
  user_email: string;
  user_name: string;
  created_date: string;
  last_modified_date: string;
  localcli?: LocalClient;
}

export interface UserWithAccounts {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    username?: string;
    enabled: boolean;
  };
  accounts: Account[];
  accountCount: number;
  activeAccountCount: number;
  disabledAccountCount: number;
}

export interface CreateAccountRequest {
  cod_cli: number;
  libcli: string;
  identite: string;
  trade?: number;
  adress: string;
  ind_societe: string;
  chef_file: string;
  cloture?: boolean;
  disabled?: boolean;
  localcli?: LocalClient;
}

export interface UpdateAccountRequest {
  cod_cli?: number;
  libcli?: string;
  identite?: string;
  trade?: number;
  adress?: string;
  ind_societe?: string;
  chef_file?: string;
  cloture?: boolean;
  disabled?: boolean;
  localcli?: LocalClient;
}

export interface DashboardSummary {
  // User Statistics
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  blockedUsers: number;
  
  // Account Statistics
  totalAccounts: number;
  activeAccounts: number;
  disabledAccounts: number;
  closedAccounts: number;
  accountsWithTrade: number;
  accountsWithTradeQB: number;
}

export interface SefClient {
  identite: string;
  nat_pid: string;
  pwd: string;
  libelle: string;
  adresse: string;
  email: string;
  mobile: string;
  lastPwdChange: string;
  tradeQB: boolean;
  keycloak_user_id?: string;
  created_date?: string;
  last_modified_date?: string;
}

export interface CreateSefClientRequest {
  identite: string;
  nat_pid: string;
  pwd: string;
  libelle: string;
  adresse: string;
  email: string;
  mobile?: string;
  tradeQB: boolean;
  keycloak_user_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IntegratedAccountService {
  private apiUrl = 'http://localhost:9090/api/v1/integrated-accounts';

  constructor(private http: HttpClient) {}

  getAllUsersWithAccounts(): Observable<UserWithAccounts[]> {
    return this.http.get<UserWithAccounts[]>(`${this.apiUrl}/users-with-accounts`);
  }

  getAccountsForUser(keycloakUserId: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/user/${keycloakUserId}/accounts`);
  }

  createAccountForUser(keycloakUserId: string, request: CreateAccountRequest): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/user/${keycloakUserId}/accounts`, request);
  }

  updateAccountForUser(keycloakUserId: string, codCli: number, request: UpdateAccountRequest): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/user/${keycloakUserId}/accounts/${codCli}`, request);
  }

  deleteAccountForUser(keycloakUserId: string, codCli: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${keycloakUserId}/accounts/${codCli}`);
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/dashboard-summary`);
  }

  clearCache(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/cache/clear`, {});
  }

  healthCheck(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/health`);
  }

  // New account-centric methods
  getAllAccountsFlattened(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts/all`);
  }

  // SEF Client methods
  getAllSefClients(): Observable<SefClient[]> {
    return this.http.get<SefClient[]>(`${this.apiUrl}/sef-clients`);
  }

  createSefClient(request: CreateSefClientRequest): Observable<SefClient> {
    return this.http.post<SefClient>(`${this.apiUrl}/sef-clients`, request);
  }

  getSefClientByIdentity(identite: string): Observable<SefClient> {
    return this.http.get<SefClient>(`${this.apiUrl}/sef-clients/${identite}`);
  }

  deleteSefClient(identite: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sef-clients/${identite}`);
  }
}
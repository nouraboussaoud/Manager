import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntegratedAccountService, Account, LocalClient, SefClient, CreateSefClientRequest } from '../../services/integrated-account.service';
import { ModalService } from '../../shared/services/modal.service';

export interface AccountWithOwner extends Account {
  ownerDetails?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    username?: string;
    enabled: boolean;
  };
}

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {
  allAccounts: AccountWithOwner[] = [];
  filteredAccounts: AccountWithOwner[] = [];
  sefClients: SefClient[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  selectedAccount: AccountWithOwner | null = null;
  showOwnerDetails = false;
  showSefForm = false;
  showSefClients = false;

  // SEF Client form
  newSefClient: CreateSefClientRequest = {
    identite: '',
    nat_pid: '',
    pwd: '',
    libelle: '',
    adresse: '',
    email: '',
    mobile: '',
    tradeQB: false
  };

  // Filter options
  filterOptions = {
    status: 'all', // all, active, disabled, closed
    hasLocalClient: 'all', // all, yes, no
    hasOwner: 'all' // all, yes, no
  };

  constructor(
    private integratedAccountService: IntegratedAccountService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    console.log('AccountManagementComponent initialized');
    this.loadAllAccounts();
    this.loadSefClients();
  }

  loadAllAccounts(): void {
    this.loading = true;
    this.error = null;

    // Use the users-with-accounts endpoint to ensure we only get accounts linked to Keycloak users
    this.integratedAccountService.getAllUsersWithAccounts().subscribe({
      next: (usersWithAccounts) => {
        // Flatten all accounts from all users, ensuring they have proper Keycloak user relationships
        this.allAccounts = [];
        
        usersWithAccounts.forEach(userWithAccounts => {
          userWithAccounts.accounts.forEach(account => {
            this.allAccounts.push({
              ...account,
              ownerDetails: {
                id: userWithAccounts.user.id,
                firstname: userWithAccounts.user.firstname,
                lastname: userWithAccounts.user.lastname,
                email: userWithAccounts.user.email,
                username: userWithAccounts.user.username,
                enabled: userWithAccounts.user.enabled
              }
            });
          });
        });
        
        this.filteredAccounts = [...this.allAccounts];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users with accounts:', error);
        this.error = 'Failed to load accounts';
        this.loading = false;
      }
    });
  }

  loadSefClients(): void {
    this.integratedAccountService.getAllSefClients().subscribe({
      next: (clients) => {
        this.sefClients = clients;
      },
      error: (error) => {
        console.error('Error loading SEF clients:', error);
        this.error = 'Failed to load SEF clients';
      }
    });
  }

  filterAccounts(): void {
    let filtered = [...this.allAccounts];

    // Text search
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(account =>
        account.libcli.toLowerCase().includes(term) ||
        account.identite.includes(term) ||
        account.cod_cli.toString().includes(term) ||
        account.adress.toLowerCase().includes(term) ||
        (account.ownerDetails?.firstname.toLowerCase().includes(term)) ||
        (account.ownerDetails?.lastname.toLowerCase().includes(term)) ||
        (account.ownerDetails?.email.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (this.filterOptions.status !== 'all') {
      filtered = filtered.filter(account => {
        switch (this.filterOptions.status) {
          case 'active':
            return !account.disabled && !account.cloture;
          case 'disabled':
            return account.disabled;
          case 'closed':
            return account.cloture;
          default:
            return true;
        }
      });
    }

    // Local client filter
    if (this.filterOptions.hasLocalClient !== 'all') {
      filtered = filtered.filter(account => {
        const hasLocalClient = account.localcli !== null && account.localcli !== undefined;
        return this.filterOptions.hasLocalClient === 'yes' ? hasLocalClient : !hasLocalClient;
      });
    }

    // Owner filter
    if (this.filterOptions.hasOwner !== 'all') {
      filtered = filtered.filter(account => {
        const hasOwner = account.ownerDetails !== null && account.ownerDetails !== undefined;
        return this.filterOptions.hasOwner === 'yes' ? hasOwner : !hasOwner;
      });
    }

    this.filteredAccounts = filtered;
  }

  selectAccount(account: AccountWithOwner): void {
    this.selectedAccount = account;
    this.showOwnerDetails = true;
    this.showSefForm = false;
    this.showSefClients = false;
  }

  getAccountStatusClass(account: AccountWithOwner): string {
    if (account.disabled) return 'disabled';
    if (account.cloture) return 'closed';
    return 'active';
  }

  getAccountStatusText(account: AccountWithOwner): string {
    if (account.disabled) return 'Disabled';
    if (account.cloture) return 'Closed';
    return 'Active';
  }

  showAddToSefForm(): void {
    if (!this.selectedAccount) return;
    
    // Pre-populate form with account data
    this.newSefClient = {
      identite: this.selectedAccount.identite,
      nat_pid: this.selectedAccount.localcli?.nat_pid || '',
      pwd: '',
      libelle: this.selectedAccount.libcli,
      adresse: this.selectedAccount.adress,
      email: this.selectedAccount.localcli?.email || this.selectedAccount.ownerDetails?.email || '',
      mobile: this.selectedAccount.localcli?.mobile || '',
      tradeQB: this.selectedAccount.localcli?.tradeQB || false,
      keycloak_user_id: this.selectedAccount.keycloak_user_id
    };
    
    this.showSefForm = true;
    this.showOwnerDetails = false;
    this.showSefClients = false;
  }

  addToSef(): void {
    if (!this.selectedAccount) return;

    console.log('Creating SEF client with data:', this.newSefClient);
    this.loading = true;
    this.integratedAccountService.createSefClient(this.newSefClient).subscribe({
      next: (newClient) => {
        this.sefClients.push(newClient);
        this.showSefForm = false;
        this.showSefClients = true;
        this.loading = false;
        
        // Reset form
        this.resetSefForm();
      },
      error: (error) => {
        console.error('Error creating SEF client:', error);
        console.error('Full error details:', error.error);
        this.error = `Failed to create SEF client: ${error.error?.message || error.message}`;
        this.loading = false;
      }
    });
  }

  resetSefForm(): void {
    this.newSefClient = {
      identite: '',
      nat_pid: '',
      pwd: '',
      libelle: '',
      adresse: '',
      email: '',
      mobile: '',
      tradeQB: false
    };
  }

  showSefClientsList(): void {
    this.showSefClients = true;
    this.showOwnerDetails = false;
    this.showSefForm = false;
  }

  removeSefClient(client: SefClient): void {
    if (confirm(`Are you sure you want to remove ${client.libelle} from SEF clients?`)) {
      this.loading = true;
      this.integratedAccountService.deleteSefClient(client.identite).subscribe({
        next: () => {
          this.sefClients = this.sefClients.filter(c => c.identite !== client.identite);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting SEF client:', error);
          this.error = 'Failed to delete SEF client';
          this.loading = false;
        }
      });
    }
  }

  cancelSefForm(): void {
    this.showSefForm = false;
    this.showOwnerDetails = true;
    this.resetSefForm();
  }

  clearError(): void {
    this.error = null;
  }

  clearSelection(): void {
    this.selectedAccount = null;
    this.showOwnerDetails = false;
    this.showSefForm = false;
    this.showSefClients = false;
  }
}
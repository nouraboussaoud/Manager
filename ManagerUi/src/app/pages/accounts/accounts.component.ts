import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntegratedAccountService, UserWithAccounts, Account, CreateAccountRequest, UpdateAccountRequest } from '../../services/integrated-account.service';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  usersWithAccounts: UserWithAccounts[] = [];
  filteredUsers: UserWithAccounts[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  selectedUser: UserWithAccounts | null = null;
  showCreateForm = false;
  showEditForm = false;
  editingAccount: Account | null = null;

  newAccount: CreateAccountRequest = {
    cod_cli: 0,
    libcli: '',
    identite: '',
    trade: 0,
    adress: '',
    ind_societe: '',
    chef_file: '',
    cloture: false,
    disabled: false
  };

  constructor(
    private integratedAccountService: IntegratedAccountService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadUsersWithAccounts();
  }

  loadUsersWithAccounts(): void {
    this.loading = true;
    this.error = null;

    this.integratedAccountService.getAllUsersWithAccounts().subscribe({
      next: (users) => {
        this.usersWithAccounts = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users with accounts:', error);
        this.error = 'Failed to load users and accounts';
        this.loading = false;
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.usersWithAccounts;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.usersWithAccounts.filter(userWithAccounts =>
      userWithAccounts.user.firstname.toLowerCase().includes(term) ||
      userWithAccounts.user.lastname.toLowerCase().includes(term) ||
      userWithAccounts.user.email.toLowerCase().includes(term) ||
      userWithAccounts.accounts.some(account =>
        account.libcli.toLowerCase().includes(term) ||
        account.identite.includes(term) ||
        account.cod_cli.toString().includes(term)
      )
    );
  }

  selectUser(user: UserWithAccounts): void {
    this.selectedUser = user;
    this.showCreateForm = false;
    this.showEditForm = false;
  }

  showCreateAccountForm(): void {
    if (!this.selectedUser) return;
    
    this.newAccount = {
      cod_cli: 0,
      libcli: '',
      identite: '',
      trade: 0,
      adress: '',
      ind_societe: '',
      chef_file: '',
      cloture: false,
      disabled: false
    };
    this.showCreateForm = true;
    this.showEditForm = false;
  }

  createAccount(): void {
    if (!this.selectedUser) return;

    this.loading = true;
    this.integratedAccountService.createAccountForUser(this.selectedUser.user.id, this.newAccount).subscribe({
      next: (account) => {
        this.selectedUser!.accounts.push(account);
        this.selectedUser!.accountCount++;
        if (!account.disabled) {
          this.selectedUser!.activeAccountCount++;
        } else {
          this.selectedUser!.disabledAccountCount++;
        }
        this.showCreateForm = false;
        this.loading = false;
        this.loadUsersWithAccounts(); // Refresh data
      },
      error: (error) => {
        console.error('Error creating account:', error);
        this.error = 'Failed to create account';
        this.loading = false;
      }
    });
  }

  editAccount(account: Account): void {
    this.editingAccount = { ...account };
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  updateAccount(): void {
    if (!this.selectedUser || !this.editingAccount) return;

    const updateRequest: UpdateAccountRequest = {
      cod_cli: this.editingAccount.cod_cli,
      libcli: this.editingAccount.libcli,
      identite: this.editingAccount.identite,
      trade: this.editingAccount.trade,
      adress: this.editingAccount.adress,
      ind_societe: this.editingAccount.ind_societe,
      chef_file: this.editingAccount.chef_file,
      cloture: this.editingAccount.cloture,
      disabled: this.editingAccount.disabled,
      localcli: this.editingAccount.localcli
    };

    console.log('Updating account with request:', updateRequest);
    this.loading = true;
    this.integratedAccountService.updateAccountForUser(
      this.selectedUser.user.id,
      this.editingAccount.cod_cli,
      updateRequest
    ).subscribe({
      next: (updatedAccount) => {
        console.log('Account updated successfully:', updatedAccount);
        const index = this.selectedUser!.accounts.findIndex(acc => acc.cod_cli === updatedAccount.cod_cli);
        if (index !== -1) {
          this.selectedUser!.accounts[index] = updatedAccount;
        }
        this.showEditForm = false;
        this.editingAccount = null;
        this.loading = false;
        this.loadUsersWithAccounts(); // Refresh data
      },
      error: (error) => {
        console.error('Error updating account:', error);
        console.error('Full error details:', error.error);
        this.error = `Failed to update account: ${error.error?.message || error.message}`;
        this.loading = false;
      }
    });
  }

  deleteAccount(account: Account): void {
    if (!this.selectedUser) return;

    if (confirm(`Are you sure you want to delete account ${account.libcli}?`)) {
      this.loading = true;
      this.integratedAccountService.deleteAccountForUser(this.selectedUser.user.id, account.cod_cli).subscribe({
        next: () => {
          this.selectedUser!.accounts = this.selectedUser!.accounts.filter(acc => acc.cod_cli !== account.cod_cli);
          this.selectedUser!.accountCount--;
          if (!account.disabled) {
            this.selectedUser!.activeAccountCount--;
          } else {
            this.selectedUser!.disabledAccountCount--;
          }
          this.loading = false;
          this.loadUsersWithAccounts(); // Refresh data
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          this.error = 'Failed to delete account';
          this.loading = false;
        }
      });
    }
  }

  toggleAccountStatus(account: Account): void {
    if (!this.selectedUser) return;

    const updateRequest: UpdateAccountRequest = {
      disabled: !account.disabled
    };

    this.integratedAccountService.updateAccountForUser(
      this.selectedUser.user.id, 
      account.cod_cli, 
      updateRequest
    ).subscribe({
      next: (updatedAccount) => {
        const index = this.selectedUser!.accounts.findIndex(acc => acc.cod_cli === updatedAccount.cod_cli);
        if (index !== -1) {
          this.selectedUser!.accounts[index] = updatedAccount;
        }
        this.loadUsersWithAccounts(); // Refresh data
      },
      error: (error) => {
        console.error('Error toggling account status:', error);
        this.error = 'Failed to update account status';
      }
    });
  }

  cancelCreate(): void {
    this.showCreateForm = false;
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingAccount = null;
  }

  clearError(): void {
    this.error = null;
  }
}
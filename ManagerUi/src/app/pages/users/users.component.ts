import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ModalService } from '../../shared/services/modal.service';
import { KeycloakUserService } from '../../services/keycloak-user.service';
import { UserFormComponent } from './user-form/user-form.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  enabled: boolean;
  accountLocked?: boolean;
  roles?: string[];
  createdDate?: string;
  lastModifiedDate?: string;
  birthdate?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule, UserFormComponent, ModalComponent],
  template: `
    <div class="users-container">
      <div class="page-header">

        <div class="header-actions">
        </div>
      </div>
      
      <div class="filters-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search users..." 
            [(ngModel)]="searchTerm"
            (input)="filterUsers()"
            class="search-input">
        </div>
        
        <div class="add-user-button">
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i>
            Add New User
          </button>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading users...</p>
      </div>
      
      <div *ngIf="error" class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Users</h3>
        <p>{{ error }}</p>
        <button class="btn btn-outline" (click)="loadUsers()">Try Again</button>
      </div>
      
      <div *ngIf="!loading && !error" class="users-grid">
        <div *ngFor="let user of filteredUsers" class="user-card">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-info">
            <h3>{{ user.firstname }} {{ user.lastname }}</h3>
            <p class="user-email">{{ user.email }}</p>
            <div class="user-status">
              <span class="status-badge" [class.active]="user.enabled" [class.inactive]="!user.enabled">
                {{ user.enabled ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
          <div class="user-actions">
            <button class="action-btn edit" (click)="editUser(user)" title="Edit User">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" (click)="deleteUser(user.id)" title="Delete User">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div *ngIf="!loading && !error && filteredUsers.length === 0" class="empty-state">
        <i class="fas fa-users"></i>
        <h3>No users found</h3>
        <p>{{ searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first user' }}</p>
      </div>
    </div>
    
    <!-- User Form Modal -->
    <ng-template #userFormTemplate>
      <app-user-form 
        [user]="selectedUser" 
        (saved)="onUserSaved()" 
        (cancelled)="closeModal()">
      </app-user-form>
    </ng-template>
    
    <!-- Modal Component -->
    <app-modal></app-modal>
  `,
  styles: [`
    .users-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .header-content h1 {
      margin: 0 0 5px 0;
      color: #2c3e50;
    }
    
    .header-content p {
      margin: 0;
      color: #6c757d;
    }
    
    .filters-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      gap: 20px;
    }
    
    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;
    }
    
    .search-box i {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }
    
    .search-input {
      width: 100%;
      padding: 10px 12px 10px 40px;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      font-size: 14px;
    }
    
    .add-user-button {
      display: flex;
      align-items: center;
    }
    
    .btn-primary {
      display: inline-flex;
      align-items: center;
      padding: 10px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .btn-primary:hover {
      background: #0056b3;
    }
    
    .filter-tabs {
      display: flex;
      gap: 10px;
    }
    
    .filter-tab {
      padding: 8px 16px;
      border: 1px solid #e9ecef;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .filter-tab.active {
      background: #007cbb;
      color: white;
      border-color: #007cbb;
    }
    
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .user-card {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.2s;
    }
    
    .user-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    
    .user-avatar {
      width: 50px;
      height: 50px;
      background: #f8f9fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
    }
    
    .user-avatar i {
      font-size: 20px;
      color: #6c757d;
    }
    
    .user-info h3 {
      margin: 0 0 5px 0;
      color: #2c3e50;
      font-size: 16px;
    }
    
    .user-email {
      margin: 0 0 10px 0;
      color: #6c757d;
      font-size: 14px;
    }
    
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }
    
    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }
    
    .user-actions {
      display: flex;
      gap: 8px;
      margin-top: 15px;
    }
    
    .action-btn {
      padding: 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .action-btn.edit {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    .action-btn.delete {
      background: #ffebee;
      color: #d32f2f;
    }
    
    .loading-state, .error-state, .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007cbb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 20px;
      }
      
      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .users-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  @ViewChild('userFormTemplate') userFormTemplate!: TemplateRef<any>;
  
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  activeFilter = 'all';
  selectedUser: any = {
    firstname: '',
    lastname: '',
    email: '',
    enabled: true
  };

  constructor(
    private keycloakUserService: KeycloakUserService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    // Debug: Check token contents
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Authorities:', payload.authorities);
        console.log('Roles:', payload.roles);
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    } else {
      console.log('No token found');
    }
    
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';

    this.keycloakUserService.getAllUsers().subscribe({
      next: (keycloakUsers) => {
        // Transform Keycloak users to our User interface
        this.users = keycloakUsers.map(ku => ({
          id: ku.id!,
          firstname: ku.firstName || '',
          lastname: ku.lastName || '',
          email: ku.email || '',
          enabled: ku.enabled || false,
          accountLocked: false,
          roles: [],
          createdDate: undefined,
          lastModifiedDate: undefined,
          birthdate: ku.attributes?.['birthdate']?.[0] || undefined
        }));
        this.filterUsers();
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        } else {
          this.error = 'Failed to load users from Keycloak';
          this.loading = false;
        }
        console.error('Error loading users:', err);
      }
    });
  }

  filterUsers() {
    let filtered = this.users;

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstname.toLowerCase().includes(term) ||
        user.lastname.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    switch (this.activeFilter) {
      case 'active':
        filtered = filtered.filter(user => user.enabled);
        break;
      case 'inactive':
        filtered = filtered.filter(user => !user.enabled);
        break;
    }

    this.filteredUsers = filtered;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.filterUsers();
  }

  getActiveCount(): number {
    return this.users.filter(user => user.enabled).length;
  }

  getInactiveCount(): number {
    return this.users.filter(user => !user.enabled).length;
  }

  openCreateModal() {
    this.selectedUser = {
      firstname: '',
      lastname: '',
      email: '',
      enabled: true,
      password: ''
    };
    this.modalService.openModal('Create New User', this.userFormTemplate);
  }

  editUser(user: User) {
    this.selectedUser = { 
      ...user,
      firstname: user.firstname,
      lastname: user.lastname
    };
    this.modalService.openModal('Edit User', this.userFormTemplate);
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.keycloakUserService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.error = 'Failed to delete user';
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  onUserSaved() {
    this.closeModal();
    this.loadUsers();
  }

  closeModal() {
    this.modalService.closeModal();
  }

  createExternalUser() {
    this.router.navigate(['/create-external-user']);
  }
}



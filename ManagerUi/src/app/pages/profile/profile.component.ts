import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakUserService, KeycloakUser } from '../../services/keycloak-user.service';
import { IntegratedAccountService } from '../../services/integrated-account.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="header">
        <h1>User Profile</h1>
      </div>
      
      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <span>Loading profile...</span>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="error-message">
        <span>{{ error }}</span>
        <button (click)="clearError()" class="close-btn">&times;</button>
      </div>
      
      <div class="content" *ngIf="!loading && currentUser">
        <!-- Profile Information Card -->
        <div class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="profile-title">
              <h2>{{ currentUser.firstName }} {{ currentUser.lastName }}</h2>
              <p class="profile-email">{{ currentUser.email }}</p>
              <span class="status-badge" [class.enabled]="currentUser.enabled" [class.disabled]="!currentUser.enabled">
                {{ currentUser.enabled ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Personal Information Card -->
        <div class="info-card">
          <h3>Personal Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>First Name:</label>
              <span>{{ currentUser.firstName }}</span>
            </div>
            <div class="info-item">
              <label>Last Name:</label>
              <span>{{ currentUser.lastName }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ currentUser.email }}</span>
            </div>
            <div class="info-item" *ngIf="currentUser.username">
              <label>Username:</label>
              <span>{{ currentUser.username }}</span>
            </div>
            <div class="info-item">
              <label>User ID:</label>
              <span class="user-id">{{ currentUser.id }}</span>
            </div>
            <div class="info-item">
              <label>Account Status:</label>
              <span class="status-badge" [class.enabled]="currentUser.enabled" [class.disabled]="!currentUser.enabled">
                {{ currentUser.enabled ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
    }
    
    .header {
      margin-bottom: 30px;
    }
    
    .header h1 {
      color: #1f2937;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
    }
    
    .profile-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }
    
    .profile-info h2 {
      color: #374151;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .profile-info p {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 10px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: KeycloakUser | null = null;
  userStats: any = null;
  loading = false;
  error: string | null = null;

  constructor(
    private keycloakUserService: KeycloakUserService,
    private integratedAccountService: IntegratedAccountService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.loading = true;
    this.error = null;

    this.keycloakUserService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('Received user data:', user);
        if (user) {
          // Map backend field names to frontend field names
          this.currentUser = {
            ...user,
            firstName: user.firstname || user.firstName,
            lastName: user.lastname || user.lastName
          };
        } else {
          this.error = 'Failed to load user profile';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading current user:', error);
        this.error = 'Failed to load user profile';
        this.loading = false;
      }
    });
  }


  clearError(): void {
    this.error = null;
  }
}
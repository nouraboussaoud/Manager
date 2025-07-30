import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExternalAuthService, ExternalUserRequest } from '../../../services/external-auth.service';

@Component({
  selector: 'app-create-external-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-external-user-container">
      <div class="page-header">
        <h1>Create External User</h1>
        <p>Grant external access to collaborate with your organization</p>
      </div>

      <div class="form-container">
        <form (ngSubmit)="createUser()" #userForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="firstname">First Name *</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                [(ngModel)]="userRequest.firstname"
                class="form-control"
                required
                #firstname="ngModel"
              />
              <div *ngIf="firstname.invalid && firstname.touched" class="error-message">
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label for="lastname">Last Name *</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                [(ngModel)]="userRequest.lastname"
                class="form-control"
                required
                #lastname="ngModel"
              />
              <div *ngIf="lastname.invalid && lastname.touched" class="error-message">
                Last name is required
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="userRequest.email"
              class="form-control"
              required
              email
              #email="ngModel"
            />
            <div *ngIf="email.invalid && email.touched" class="error-message">
              <span *ngIf="email.errors?.['required']">Email is required</span>
              <span *ngIf="email.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                [(ngModel)]="userRequest.department"
                class="form-control"
                placeholder="e.g., Marketing, Sales, IT"
              />
            </div>

            <div class="form-group">
              <label for="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                [(ngModel)]="userRequest.position"
                class="form-control"
                placeholder="e.g., Consultant, Partner, Contractor"
              />
            </div>
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            <i class="fas fa-exclamation-triangle"></i>
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            {{ successMessage }}
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="cancel()"
            >
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="userForm.invalid || isSubmitting"
            >
              <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
              <i class="fas fa-user-plus" *ngIf="!isSubmitting"></i>
              {{ isSubmitting ? 'Creating...' : 'Create External User' }}
            </button>
          </div>
        </form>
      </div>

      <div class="info-panel">
        <h3><i class="fas fa-info-circle"></i> What happens next?</h3>
        <ul>
          <li>External user will receive a welcome email</li>
          <li>Email contains temporary login credentials</li>
          <li>User must change password on first login</li>
          <li>User gets limited external access only</li>
          <li>You can manage their access anytime</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .create-external-user-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      color: #28a745;
      margin-bottom: 10px;
    }

    .form-container {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin: 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .info-panel {
      background: #e8f5e8;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #28a745;
    }

    .info-panel h3 {
      color: #28a745;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-panel ul {
      list-style: none;
      padding: 0;
    }

    .info-panel li {
      padding: 5px 0;
      position: relative;
      padding-left: 20px;
    }

    .info-panel li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #28a745;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CreateExternalUserComponent {
  userRequest: ExternalUserRequest = {
    firstname: '',
    lastname: '',
    email: '',
    department: '',
    position: ''
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private externalAuthService: ExternalAuthService,
    private router: Router
  ) {}

  createUser() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.externalAuthService.createExternalUser(this.userRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = response;
        
        // Reset form after success
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error creating external user:', err);
        
        if (err.error) {
          this.errorMessage = typeof err.error === 'string' ? err.error : 'Failed to create external user';
        } else {
          this.errorMessage = 'Failed to create external user. Please try again.';
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
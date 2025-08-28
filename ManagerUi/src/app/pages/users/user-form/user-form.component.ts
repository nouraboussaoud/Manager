import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  enabled: boolean;
  password?: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="saveUser()" #userForm="ngForm">
      <div class="form-group">
        <label for="firstname">First Name</label>
        <input 
          type="text" 
          id="firstname" 
          name="firstname" 
          class="form-control" 
          [(ngModel)]="user.firstname" 
          required 
          #firstname="ngModel">
        <div *ngIf="firstname.invalid && (firstname.dirty || firstname.touched)" class="error-message">
          First name is required
        </div>
      </div>
      
      <div class="form-group">
        <label for="lastname">Last Name</label>
        <input 
          type="text" 
          id="lastname" 
          name="lastname" 
          class="form-control" 
          [(ngModel)]="user.lastname" 
          required 
          #lastname="ngModel">
        <div *ngIf="lastname.invalid && (lastname.dirty || lastname.touched)" class="error-message">
          Last name is required
        </div>
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          class="form-control" 
          [(ngModel)]="user.email" 
          required 
          email 
          #email="ngModel">
        <div *ngIf="email.invalid && (email.dirty || email.touched)" class="error-message">
          <div *ngIf="email.errors?.['required']">Email is required</div>
          <div *ngIf="email.errors?.['email']">Please enter a valid email</div>
        </div>
      </div>
      
      <div class="form-group" *ngIf="!user.id">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          class="form-control" 
          [(ngModel)]="user.password" 
          required 
          minlength="8" 
          #password="ngModel">
        <div *ngIf="password.invalid && (password.dirty || password.touched)" class="error-message">
          <div *ngIf="password.errors?.['required']">Password is required</div>
          <div *ngIf="password.errors?.['minlength']">Password must be at least 8 characters</div>
        </div>
      </div>
      
      <div class="form-group checkbox-group">
        <label class="checkbox-container">
          <input 
            type="checkbox" 
            id="enabled" 
            name="enabled" 
            [(ngModel)]="user.enabled">
          <span class="checkmark"></span>
          <span class="checkbox-label">Active Account</span>
        </label>
      </div>
      
      <div *ngIf="errorMessage" class="alert-error">
        <i class="fas fa-exclamation-triangle"></i> {{ errorMessage }}
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
        <button 
          type="submit" 
          class="btn btn-primary" 
          [disabled]="userForm.invalid || isSubmitting">
          <span *ngIf="isSubmitting">
            <i class="fas fa-spinner fa-spin"></i> Saving...
          </span>
          <span *ngIf="!isSubmitting">
            <i class="fas fa-save"></i> Save User
          </span>
        </button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      /* Color Palette */
      --primary-color: #1a237e;
      --primary-light: #3949ab;
      --primary-dark: #000051;
      --secondary-color: #00695c;
      --secondary-light: #009688;
      --accent-color: #ff6f00;
      --accent-light: #ff9800;
  
      /* Neutral Colors */
      --surface-color: #ffffff;
      --background-color: #f8fafc;
      --card-background: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-light: #94a3b8;
      --border-color: #e2e8f0;
      --border-light: #f1f5f9;
  
      /* Shadow System */
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary-light);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-control.ng-invalid.ng-touched {
      border-color: #e74c3c;
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 5px;
    }
    
    .checkbox-group {
      margin-top: 25px;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }
    
    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    .checkmark {
      height: 22px;
      width: 22px;
      background-color: #fff;
      border: 2px solid var(--border-color);
      border-radius: 4px;
      margin-right: 10px;
      position: relative;
      transition: all 0.2s;
    }
    
    .checkbox-container:hover input ~ .checkmark {
      border-color: var(--primary-light);
    }
    
    .checkbox-container input:checked ~ .checkmark {
      background-color: var(--primary-light);
      border-color: var(--primary-light);
    }
    
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    
    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }
    
    .checkbox-container .checkmark:after {
      left: 7px;
      top: 3px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .checkbox-label {
      font-size: 1rem;
      color: var(--text-primary);
    }
    
    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    
    .alert-error i {
      margin-right: 10px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-primary {
      background-color: #007bff;
      border: none;
      color: white;
      transition: background-color 0.3s ease;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .btn-primary:disabled {
      background-color: #cce5ff;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background: #f8f9fa;
      color: #6c757d;
      border: 1px solid var(--border-color);
    }
    
    .btn-secondary:hover {
      background: var(--border-light);
    }
  `]
})
export class UserFormComponent {
  @Input() user: User = {
    firstname: '',
    lastname: '',
    email: '',
    enabled: true,
    password: ''
  };
  
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  
  isSubmitting = false;
  errorMessage = '';
  
  constructor(private http: HttpClient) {}
  
  saveUser() {
    this.isSubmitting = true;
    this.errorMessage = '';
    
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    const apiCall = this.user.id 
      ? this.http.put(`http://localhost:9090/api/v1/users/${this.user.id}`, this.user, { headers })
      : this.http.post('http://localhost:9090/api/v1/users', this.user, { 
          headers, 
          responseType: 'text' // Handle plain text response
        });
    
    apiCall.subscribe({
      next: (response) => {
        this.isSubmitting = false;
        console.log('User saved successfully:', response);
        this.saved.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Full error object:', err);
        
        if (err.error?.businessErrorDescription) {
          this.errorMessage = err.error.businessErrorDescription;
        } else if (err.error?.error?.includes('Status: 409')) {
          this.errorMessage = 'A user with this email already exists in Keycloak.';
        } else if (err.status === 409) {
          this.errorMessage = 'A user with this email already exists.';
        } else {
          this.errorMessage = `Failed to save user. Status: ${err.status}`;
        }
      }
    });
  }
  
  cancel() {
    this.cancelled.emit();
  }
}






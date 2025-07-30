import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExternalAuthService, ExternalAuthRequest } from '../../services/external-auth.service';

@Component({
  selector: 'app-external-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="external-auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">🌐 Manager System</div>
          <div class="external-badge">EXTERNAL ACCESS</div>
          <h2>External User Login</h2>
          <p>Access your external collaboration portal</p>
        </div>

        <form (ngSubmit)="login()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="authRequest.email"
              class="form-control"
              placeholder="Enter your email"
              required
              email
              #email="ngModel"
            />
            <div *ngIf="email.invalid && email.touched" class="error-message">
              <span *ngIf="email.errors?.['required']">Email is required</span>
              <span *ngIf="email.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="authRequest.password"
                class="form-control"
                placeholder="Enter your password"
                required
                #password="ngModel"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="showPassword = !showPassword"
              >
                <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div *ngIf="password.invalid && password.touched" class="error-message">
              Password is required
            </div>
          </div>

          <div *ngIf="errorMsg.length > 0" class="alert alert-error">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
              <div *ngFor="let error of errorMsg">{{ error }}</div>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="loginForm.invalid || isLoading"
          >
            <i class="fas fa-spinner fa-spin" *ngIf="isLoading"></i>
            <i class="fas fa-sign-in-alt" *ngIf="!isLoading"></i>
            {{ isLoading ? 'Signing In...' : 'Sign In to External Portal' }}
          </button>
        </form>

        <div class="auth-footer">
          <div class="forgot-password">
            <a (click)="showForgotPassword = true" class="link">
              <i class="fas fa-key"></i>
              Forgot your password?
            </a>
          </div>
          
          <div class="divider">
            <span>or</span>
          </div>
          
          <div class="internal-login">
            <p>Internal user?</p>
            <a routerLink="/login" class="btn btn-outline">
              <i class="fas fa-building"></i>
              Internal Login
            </a>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div *ngIf="showForgotPassword" class="modal-overlay" (click)="showForgotPassword = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Reset Password</h3>
            <button class="close-btn" (click)="showForgotPassword = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form (ngSubmit)="resetPassword()" #resetForm="ngForm">
            <div class="form-group">
              <label for="resetEmail">Email Address</label>
              <input
                type="email"
                id="resetEmail"
                name="resetEmail"
                [(ngModel)]="resetEmail"
                class="form-control"
                placeholder="Enter your email"
                required
                email
              />
            </div>
            
            <div *ngIf="resetMessage" class="alert alert-success">
              <i class="fas fa-check-circle"></i>
              {{ resetMessage }}
            </div>
            
            <div *ngIf="resetError" class="alert alert-error">
              <i class="fas fa-exclamation-triangle"></i>
              {{ resetError }}
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="showForgotPassword = false">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="resetForm.invalid || isResetting">
                <i class="fas fa-spinner fa-spin" *ngIf="isResetting"></i>
                {{ isResetting ? 'Sending...' : 'Send Reset Email' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .external-auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    .auth-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      overflow: hidden;
      width: 100%;
      max-width: 400px;
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .auth-header {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 30px;
      text-align: center;
    }

    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .external-badge {
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      display: inline-block;
      margin-bottom: 15px;
      letter-spacing: 1px;
    }

    .auth-header h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
    }

    .auth-header p {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }

    .auth-form {
      padding: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s, box-shadow 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }

    .password-input {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 4px;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin: 15px 0;
      display: flex;
      align-items: flex-start;
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

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
    }

    .btn-outline {
      background: transparent;
      color: #28a745;
      border: 1px solid #28a745;
    }

    .btn-outline:hover {
      background: #28a745;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-block {
      width: 100%;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      padding: 20px 30px 30px;
      text-align: center;
    }

    .forgot-password {
      margin-bottom: 20px;
    }

    .link {
      color: #28a745;
      text-decoration: none;
      cursor: pointer;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .link:hover {
      text-decoration: underline;
    }

    .divider {
      margin: 20px 0;
      position: relative;
      color: #6c757d;
      font-size: 12px;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e9ecef;
    }

    .divider span {
      background: white;
      padding: 0 15px;
      position: relative;
    }

    .internal-login p {
      margin: 0 0 10px 0;
      color: #6c757d;
      font-size: 14px;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 25px;
      border-bottom: 1px solid #e9ecef;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 18px;
      color: #6c757d;
      cursor: pointer;
      padding: 4px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    @media (max-width: 480px) {
      .external-auth-container {
        padding: 1rem;
      }
      
      .auth-form {
        padding: 20px;
      }
      
      .auth-footer {
        padding: 15px 20px 20px;
      }
    }
  `]
})
export class ExternalLoginComponent {
  authRequest: ExternalAuthRequest = {
    email: '',
    password: ''
  };

  errorMsg: string[] = [];
  isLoading = false;
  showPassword = false;
  showForgotPassword = false;
  resetEmail = '';
  resetMessage = '';
  resetError = '';
  isResetting = false;

  constructor(
    private router: Router,
    private externalAuthService: ExternalAuthService
  ) {}

  login() {
    this.errorMsg = [];
    this.isLoading = true;

    console.log('Attempting external login with:', { 
      email: this.authRequest.email,
      password: this.authRequest.password ? '***PASSWORD_SET***' : 'NO_PASSWORD',
      passwordLength: this.authRequest.password?.length || 0
    });

    this.externalAuthService.loginExternal(this.authRequest).subscribe({
      next: (response) => {
        console.log('External login successful:', response);
        this.isLoading = false;
        
        if (response.requiresPasswordChange) {
          console.log('Password change required, redirecting...');
          this.router.navigate(['/external-change-password']);
        } else {
          console.log('Login complete, redirecting to dashboard...');
          this.router.navigate(['/external-dashboard']);
        }
      },
      error: (err) => {
        console.error('External login error details:', err);
        this.isLoading = false;
        
        if (err.status === 401) {
          this.errorMsg = ['Invalid email or password'];
        } else if (err.error?.message) {
          this.errorMsg = [err.error.message];
        } else {
          this.errorMsg = ['Login failed. Please try again.'];
        }
      }
    });
  }

  resetPassword() {
    this.resetError = '';
    this.resetMessage = '';
    this.isResetting = true;

    this.externalAuthService.forgotPassword({ email: this.resetEmail }).subscribe({
      next: (response) => {
        this.isResetting = false;
        this.resetMessage = 'Password reset email sent successfully!';
        
        setTimeout(() => {
          this.showForgotPassword = false;
          this.resetEmail = '';
          this.resetMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.isResetting = false;
        this.resetError = 'Failed to send reset email. Please try again.';
      }
    });
  }
}



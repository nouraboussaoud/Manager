import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { AuthService } from '../../services/auth.service';

interface AuthenticationRequest {
  email: string;
  password: string;
}

interface AuthenticationResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authRequest: AuthenticationRequest = {
    email: '',
    password: ''
  };

  errorMsg: string[] = [];
  isLoading = false;
  showGeneralError = false;
  showPassword = false;
  
  // Input validation states
  emailTouched = false;
  passwordTouched = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Email validation
  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.authRequest.email);
  }

  // Password validation  
  isPasswordValid(): boolean {
    return this.authRequest.password.length >= 6;
  }

  // Form validation
  isFormValid(): boolean {
    return this.isEmailValid() && this.isPasswordValid() && 
           this.authRequest.email.length > 0 && this.authRequest.password.length > 0;
  }

  // Track input touch for validation display
  onEmailBlur() {
    this.emailTouched = true;
  }

  onPasswordBlur() {
    this.passwordTouched = true;
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Get email error message
  getEmailError(): string {
    if (!this.emailTouched) return '';
    if (this.authRequest.email.length === 0) return 'Email address is required';
    if (!this.isEmailValid()) return 'Please enter a valid email address';
    return '';
  }

  // Get password error message
  getPasswordError(): string {
    if (!this.passwordTouched) return '';
    if (this.authRequest.password.length === 0) return 'Password is required';
    if (!this.isPasswordValid()) return 'Password must be at least 6 characters long';
    return '';
  }

  login() {
    // Mark all fields as touched for validation
    this.emailTouched = true;
    this.passwordTouched = true;
    
    // Clear previous errors
    this.errorMsg = [];
    this.showGeneralError = false;

    // Validate form before submitting
    if (!this.isFormValid()) {
      this.errorMsg = ['Please correct the errors below'];
      return;
    }

    this.isLoading = true;

    this.authService.authenticate(this.authRequest).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.errorMsg = [];
        this.showGeneralError = false;
        this.router.navigate(['dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleAuthError(err);
      }
    });
  }

  private handleAuthError(error: HttpErrorResponse) {
    this.errorMsg = [];
    this.showGeneralError = true;

    switch (error.status) {
      case 401:
        this.errorMsg = ['Invalid email or password.'];
        break;
      case 403:
        this.errorMsg = ['Access denied. Your account may be inactive or suspended.'];
        break;
      case 429:
        this.errorMsg = ['Too many login attempts. Please wait a few minutes before trying again.'];
        break;
      case 500:
        this.errorMsg = ['Server error. Please try again later or contact support.'];
        break;
      case 0:
        this.errorMsg = ['Connection error. Please check your internet connection and try again.'];
        break;
      default:
        if (error.error && error.error.message) {
          this.errorMsg = [error.error.message];
        } else if (error.error && typeof error.error === 'string') {
          this.errorMsg = [error.error];
        } else {
          this.errorMsg = ['An unexpected error occurred. Please try again.'];
        }
        break;
    }

    // Auto-clear error after 10 seconds
    setTimeout(() => {
      this.errorMsg = [];
      this.showGeneralError = false;
    }, 10000);
  }

  register() {
    this.router.navigate(['register']);
  }
}






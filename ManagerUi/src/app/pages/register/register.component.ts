import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { AuthService } from '../../services/auth.service';

interface RegistrationRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerRequest: RegistrationRequest = {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  };

  errorMsg: string[] = [];
  isLoading = false;
  showPassword = false;
  showGeneralError = false;
  firstnameTouched = false;
  lastnameTouched = false;
  emailTouched = false;
  passwordTouched = false;

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFirstnameBlur() {
    this.firstnameTouched = true;
  }

  onLastnameBlur() {
    this.lastnameTouched = true;
  }

  onEmailBlur() {
    this.emailTouched = true;
  }

  onPasswordBlur() {
    this.passwordTouched = true;
  }

  getFirstnameError(): string | null {
    if (!this.registerRequest.firstname?.trim()) {
      return 'First name is required';
    }
    if (this.registerRequest.firstname.length < 2) {
      return 'First name must be at least 2 characters';
    }
    return null;
  }

  getLastnameError(): string | null {
    if (!this.registerRequest.lastname?.trim()) {
      return 'Last name is required';
    }
    if (this.registerRequest.lastname.length < 2) {
      return 'Last name must be at least 2 characters';
    }
    return null;
  }

  getEmailError(): string | null {
    if (!this.registerRequest.email?.trim()) {
      return 'Email address is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerRequest.email)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  getPasswordError(): string | null {
    if (!this.registerRequest.password) {
      return 'Password is required';
    }
    if (this.registerRequest.password.length < 12) {
      return 'Password must be at least 12 characters long';
    }
    return null;
  }

  login() {
    this.router.navigate(['login']);
  }

  isFormValid(): boolean {
    return (
      !!this.registerRequest.firstname.trim() &&
      !!this.registerRequest.lastname.trim() &&
      !!this.registerRequest.email.trim() &&
      this.registerRequest.password.length >= 12
    );
  }

  register() {
    this.errorMsg = [];
    this.isLoading = true;

    if (!this.isFormValid()) {
      this.isLoading = false;
      return;
    }

    this.authService.register(this.registerRequest).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['activate-account']);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleRegistrationError(error);
      }
    });
  }

  private handleRegistrationError(error: any) {
    if (error.status === 409) {
      this.errorMsg = ['An account with this email address already exists.'];
    } else if (error.status === 400) {
      this.errorMsg = ['Please check your information and try again.'];
    } else {
      this.errorMsg = ['Registration failed. Please try again later.'];
    }
  }
}







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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  register() {
    this.errorMsg = [];
    this.isLoading = true;

    this.authService.register(this.registerRequest).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.router.navigate(['activate-account']);
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Registration error:', err);
        
        if (err.error?.businessErrorDescription) {
          this.errorMsg.push(err.error.businessErrorDescription);
        } else if (err.error?.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else if (err.error?.error && err.error.error.includes('duplicate key')) {
          this.errorMsg.push('An account with this email address already exists. Please use a different email or try signing in.');
        } else if (err.status === 409) {
          this.errorMsg.push('An account with this email address already exists. Please use a different email or try signing in.');
        } else if (err.status === 400) {
          this.errorMsg.push('Please check your information and try again.');
        } else {
          this.errorMsg.push('Registration failed. Please try again later.');
        }
      }
    });
  }

  login() {
    this.router.navigate(['login']);
  }
}






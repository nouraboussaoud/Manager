import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule],
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent {
  message = '';
  isOkay = true;
  submitted = false;
  isLoading = false;
  token = '';
  errorMsg: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onCodeInput() {
    // Clear errors when user starts typing
    this.errorMsg = [];
  }

  onCodeCompleted() {
    if (this.token.length === 6) {
      this.confirmAccount(this.token);
    }
  }

  confirmAccount(token: string) {
    this.isLoading = true;
    this.submitted = false;
    this.errorMsg = [];
    
    this.authService.activateAccount(token).subscribe({
      next: (response) => {
        this.message = 'Account activated successfully! You can now sign in.';
        this.isOkay = true;
        this.isLoading = false;
        this.submitted = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleActivationError(error);
      }
    });
  }

  private handleActivationError(error: any) {
    if (error.status === 400) {
      this.errorMsg = ['Invalid or expired verification code.'];
    } else if (error.status === 404) {
      this.errorMsg = ['Account not found.'];
    } else if (error.status === 409) {
      this.errorMsg = ['Account is already activated.'];
    } else if (error.status === 500) {
      this.errorMsg = ['Server error. Please try again later.'];
    } else if (error.status === 0) {
      this.errorMsg = ['Unable to connect to server. Please check your connection.'];
    } else {
      this.errorMsg = ['Activation failed. Please try again.'];
    }
  }

  resendCode() {
    // Add resend logic here if needed
    this.errorMsg = [];
    this.token = '';
  }

  tryAgain() {
    this.submitted = false;
    this.errorMsg = [];
    this.token = '';
    this.isOkay = true;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}





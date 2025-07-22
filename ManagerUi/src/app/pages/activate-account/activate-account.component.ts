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

  constructor(
    private router: Router,
    private authService: AuthService // Use AuthService
  ) {}

  onCodeCompleted() {
    console.log('Code completed, token length:', this.token.length, 'Token:', this.token); // Debug
    if (this.token.length === 6) {
      this.confirmAccount(this.token);
    } else {
      console.log('Token length is not 6, current length:', this.token.length); // Debug
    }
  }

  confirmAccount(token: string) {
    this.isLoading = true;
    this.submitted = false; // Reset submitted state
    
    console.log('Attempting to activate account with token:', token); // Debug log
    
    this.authService.activateAccount(token).subscribe({
      next: (response) => {
        console.log('Activation successful:', response); // Debug log
        this.message = 'Account activated successfully!';
        this.isOkay = true;
        this.isLoading = false;
        this.submitted = true; // Show result section
      },
      error: (error) => {
        console.error('Activation failed:', error); // Debug log
        this.message = 'Activation failed. Please check your code and try again.';
        this.isOkay = false;
        this.isLoading = false;
        this.submitted = true; // Show result section
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  tryAgain() {
    this.submitted = false;
    this.token = '';
    this.message = '';
  }

  resendCode() {
    // TODO: Implement resend functionality
    console.log('Resend code functionality to be implemented');
  }
}





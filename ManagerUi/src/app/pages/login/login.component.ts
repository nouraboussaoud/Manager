import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.errorMsg = [];
    this.isLoading = true;

    this.authService.authenticate(this.authRequest).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.router.navigate(['dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        // Handle error
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}






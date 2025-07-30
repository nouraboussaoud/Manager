import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExternalAuthService } from '../../services/external-auth.service';

@Component({
  selector: 'app-external-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="external-dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <div class="logo-section">
            <h1>🌐 External Portal</h1>
            <span class="external-badge">EXTERNAL ACCESS</span>
          </div>
          
          <div class="user-section">
            <div class="user-info" *ngIf="currentUser">
              <span class="welcome-text">Welcome, {{ currentUser.firstname }}!</span>
              <div class="user-menu">
                <button class="btn btn-outline" (click)="logout()">
                  <i class="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="welcome-section">
          <div class="welcome-card">
            <h2>Welcome to Your External Portal</h2>
            <p>You have been granted external access to collaborate with our organization.</p>
            
            <div class="user-details" *ngIf="currentUser">
              <div class="detail-item">
                <strong>Name:</strong> {{ currentUser.firstname }} {{ currentUser.lastname }}
              </div>
              <div class="detail-item">
                <strong>Email:</strong> {{ currentUser.email }}
              </div>
              <div class="detail-item">
                <strong>Access Level:</strong> External User
              </div>
            </div>
          </div>
        </div>

        <div class="features-section">
          <h3>Available Features</h3>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <h4>Documents</h4>
              <p>Access shared documents and resources</p>
              <button class="btn btn-primary" disabled>
                Coming Soon
              </button>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-comments"></i>
              </div>
              <h4>Messages</h4>
              <p>Communicate with internal team members</p>
              <button class="btn btn-primary" disabled>
                Coming Soon
              </button>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-calendar"></i>
              </div>
              <h4>Meetings</h4>
              <p>Schedule and join collaborative meetings</p>
              <button class="btn btn-primary" disabled>
                Coming Soon
              </button>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-user-cog"></i>
              </div>
              <h4>Profile</h4>
              <p>Manage your external user profile</p>
              <button class="btn btn-primary" (click)="goToProfile()">
                Manage Profile
              </button>
            </div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-card">
            <h4><i class="fas fa-info-circle"></i> Important Information</h4>
            <ul>
              <li>Your access is limited to external collaboration features</li>
              <li>All activities may be monitored for security purposes</li>
              <li>Contact your administrator for additional access requests</li>
              <li>Keep your login credentials secure and confidential</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .external-dashboard {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 20px 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .logo-section h1 {
      margin: 0;
      font-size: 24px;
    }

    .external-badge {
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .welcome-text {
      font-weight: 500;
    }

    .user-menu {
      margin-left: 15px;
    }

    .dashboard-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .welcome-section {
      margin-bottom: 40px;
    }

    .welcome-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }

    .welcome-card h2 {
      color: #28a745;
      margin-bottom: 15px;
    }

    .welcome-card p {
      color: #6c757d;
      margin-bottom: 25px;
    }

    .user-details {
      display: inline-block;
      text-align: left;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #28a745;
    }

    .detail-item {
      margin-bottom: 10px;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .features-section h3 {
      color: #333;
      margin-bottom: 25px;
      text-align: center;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .feature-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 48px;
      color: #28a745;
      margin-bottom: 15px;
    }

    .feature-card h4 {
      color: #333;
      margin-bottom: 10px;
    }

    .feature-card p {
      color: #6c757d;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .info-section {
      margin-top: 40px;
    }

    .info-card {
      background: #e3f2fd;
      padding: 25px;
      border-radius: 12px;
      border-left: 4px solid #2196f3;
    }

    .info-card h4 {
      color: #1976d2;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-card ul {
      margin: 0;
      padding-left: 20px;
    }

    .info-card li {
      margin-bottom: 8px;
      color: #333;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
      gap: 8px;
      font-size: 14px;
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
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
    }

    .btn-outline:hover {
      background: rgba(255,255,255,0.1);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .dashboard-main {
        padding: 20px 15px;
      }
    }
  `]
})
export class ExternalDashboardComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private externalAuthService: ExternalAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.externalAuthService.getExternalUserData();
    
    if (!this.currentUser) {
      this.router.navigate(['/external-login']);
    }
  }

  logout() {
    this.externalAuthService.logout();
    this.router.navigate(['/external-login']);
  }

  goToProfile() {
    this.router.navigate(['/external-profile']);
  }
}
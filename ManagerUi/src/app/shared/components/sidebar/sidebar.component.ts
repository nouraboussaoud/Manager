import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">
            <i class="fas fa-users-cog"></i>
          </div>
          <span class="logo-text" *ngIf="!isCollapsed">Manager</span>
        </div>
        <button class="toggle-btn" (click)="toggleSidebar()">
          <i class="fas fa-bars" *ngIf="isCollapsed"></i>
          <i class="fas fa-times" *ngIf="!isCollapsed"></i>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-item">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <div class="nav-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <span class="nav-text" *ngIf="!isCollapsed">Dashboard</span>
          </a>
        </div>
        
        <div class="nav-item">
          <a routerLink="/users" routerLinkActive="active" class="nav-link">
            <div class="nav-icon">
              <i class="fas fa-users"></i>
            </div>
            <span class="nav-text" *ngIf="!isCollapsed">Users</span>
          </a>
        </div>
        
        <div class="nav-item">
          <a routerLink="/accounts" routerLinkActive="active" class="nav-link">
            <div class="nav-icon">
              <i class="fas fa-user-friends"></i>
            </div>
            <span class="nav-text" *ngIf="!isCollapsed">Users & Accounts</span>
          </a>
        </div>
        
        <div class="nav-item">
          <a routerLink="/account-management" routerLinkActive="active" class="nav-link">
            <div class="nav-icon">
              <i class="fas fa-building"></i>
            </div>
            <span class="nav-text" *ngIf="!isCollapsed">All Accounts</span>
          </a>
        </div>
        
        <div class="nav-item">
          <a routerLink="/profile" routerLinkActive="active" class="nav-link">
            <div class="nav-icon">
              <i class="fas fa-user"></i>
            </div>
            <span class="nav-text" *ngIf="!isCollapsed">Profile</span>
          </a>
        </div>
        
        <div class="nav-item">
          <a routerLink="/settings" routerLinkActive="active" class="nav-link">
            <div class="nav-icon">
              <i class="fas fa-cog"></i>
            </div>
            <span class="nav-text" *ngIf="!isCollapsed">Settings</span>
          </a>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()">
          <div class="logout-icon">
            <i class="fas fa-sign-out-alt"></i>
          </div>
          <span class="logout-text" *ngIf="!isCollapsed">Logout</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 260px;
      background: #ffffff;
      transition: width 0.3s ease;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      border-right: 1px solid #e5e7eb;
    }
    
    .sidebar.collapsed {
      width: 80px;
    }
    
    .sidebar-header {
      height: 70px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e5e7eb;
      background: #ffffff; /* Soft white background */
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #007bff; /* Updated to match the app's blue color */
      border-radius: 10px;
      color: white;
      font-size: 18px;
    }
    
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }
    
    .toggle-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .toggle-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 20px 0;
      overflow-y: auto;
    }
    
    .nav-item {
      margin-bottom: 8px;
      padding: 0 16px;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      text-decoration: none;
      color: #6b7280;
      transition: all 0.2s;
      font-weight: 500;
    }
    
    .nav-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: #f8fafc;
      color: #6b7280;
      font-size: 16px;
      transition: all 0.2s;
    }
    
    .nav-text {
      font-size: 15px;
      white-space: nowrap;
    }
    
    .nav-link:hover {
      background: #007bff; /* Updated hover color */
      color: white;
    }
    
    .nav-link:hover .nav-icon {
      background: #e0e7ff;
      color: #3b82f6;
    }
    
    .nav-link.active {
      background: #eff6ff;
      color: #1e40af;
    }
    
    .nav-link.active .nav-icon {
      background: #3b82f6;
      color: white;
    }
    
    .sidebar-footer {
      padding: 20px 16px;
      border-top: 1px solid #f1f5f9;
    }
    
    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      color: #dc2626;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }
    
    .logout-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: #fee2e2;
      color: #dc2626;
      font-size: 16px;
    }
    
    .logout-text {
      font-size: 15px;
      white-space: nowrap;
    }
    
    .logout-btn:hover {
      background: #fee2e2;
      border-color: #fca5a5;
    }
    
    .logout-btn:hover .logout-icon {
      background: #fecaca;
    }
  `]
})
export class SidebarComponent {
  isCollapsed = false;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    // Add logout logic here
    this.router.navigate(['/login']);
  }
}











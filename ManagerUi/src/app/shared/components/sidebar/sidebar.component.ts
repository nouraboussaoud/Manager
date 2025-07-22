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
        <div class="logo">
          <i class="fas fa-users-cog"></i>
          <span *ngIf="!isCollapsed">Manager</span>
        </div>
        <button class="toggle-btn" (click)="toggleSidebar()">
          <i class="fas" [class.fa-bars]="isCollapsed" [class.fa-times]="!isCollapsed"></i>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <i class="fas fa-tachometer-alt"></i>
              <span *ngIf="!isCollapsed">Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/users" routerLinkActive="active" class="nav-link">
              <i class="fas fa-users"></i>
              <span *ngIf="!isCollapsed">Users</span>
            </a>
          </li>
          <li>
            <a routerLink="/profile" routerLinkActive="active" class="nav-link">
              <i class="fas fa-user"></i>
              <span *ngIf="!isCollapsed">Profile</span>
            </a>
          </li>
          <li>
            <a routerLink="/settings" routerLinkActive="active" class="nav-link">
              <i class="fas fa-cog"></i>
              <span *ngIf="!isCollapsed">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span *ngIf="!isCollapsed">Logout</span>
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
      width: 250px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transition: width 0.3s ease;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }
    
    .sidebar.collapsed {
      width: 70px;
    }
    
    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .logo {
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .logo i {
      margin-right: 10px;
      font-size: 1.8rem;
    }
    
    .toggle-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    .toggle-btn:hover {
      background-color: rgba(255,255,255,0.1);
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 20px 0;
    }
    
    .sidebar-nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .sidebar-nav li {
      margin-bottom: 5px;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      transition: all 0.3s;
      border-left: 3px solid transparent;
    }
    
    .nav-link:hover {
      background-color: rgba(255,255,255,0.1);
      color: white;
      border-left-color: #fff;
    }
    
    .nav-link.active {
      background-color: rgba(255,255,255,0.2);
      color: white;
      border-left-color: #fff;
    }
    
    .nav-link i {
      margin-right: 15px;
      font-size: 1.2rem;
      width: 20px;
      text-align: center;
    }
    
    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .logout-btn {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 15px 20px;
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;
      font-size: 1rem;
    }
    
    .logout-btn:hover {
      background: rgba(255,255,255,0.2);
    }
    
    .logout-btn i {
      margin-right: 15px;
      font-size: 1.2rem;
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
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
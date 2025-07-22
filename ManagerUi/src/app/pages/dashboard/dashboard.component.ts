import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your system.</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon users">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>{{ totalUsers }}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon active">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="stat-content">
            <h3>{{ activeUsers }}</h3>
            <p>Active Users</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="fas fa-user-clock"></i>
          </div>
          <div class="stat-content">
            <h3>{{ pendingUsers }}</h3>
            <p>Pending Users</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon blocked">
            <i class="fas fa-user-lock"></i>
          </div>
          <div class="stat-content">
            <h3>{{ blockedUsers }}</h3>
            <p>Blocked Users</p>
          </div>
        </div>
      </div>
      
      <div class="dashboard-cards">
        <div class="action-card" (click)="navigateToUsers()">
          <div class="card-icon">
            <i class="fas fa-users-cog"></i>
          </div>
          <div class="card-content">
            <h3>User Management</h3>
            <p>Manage system users, roles, and permissions</p>
          </div>
          <div class="card-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
        
        <div class="action-card" (click)="navigateToReports()">
          <div class="card-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
          <div class="card-content">
            <h3>Reports</h3>
            <p>View system analytics and user activity reports</p>
          </div>
          <div class="card-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
        
        <div class="action-card" (click)="navigateToSettings()">
          <div class="card-icon">
            <i class="fas fa-cogs"></i>
          </div>
          <div class="card-content">
            <h3>Settings</h3>
            <p>Configure system settings and preferences</p>
          </div>
          <div class="card-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      margin-bottom: 30px;
    }
    
    .dashboard-header h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 10px;
      font-weight: 300;
    }
    
    .dashboard-header p {
      color: #7f8c8d;
      font-size: 1.1rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    }
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      font-size: 1.5rem;
      color: white;
    }
    
    .stat-icon.users { background: linear-gradient(135deg, #667eea, #764ba2); }
    .stat-icon.active { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .stat-icon.pending { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .stat-icon.blocked { background: linear-gradient(135deg, #43e97b, #38f9d7); }
    
    .stat-content h3 {
      font-size: 2rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 0 0 5px 0;
    }
    
    .stat-content p {
      color: #7f8c8d;
      margin: 0;
      font-size: 0.9rem;
    }
    
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
    }
    
    .action-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #e9ecef;
    }
    
    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      border-color: #667eea;
    }
    
    .card-icon {
      width: 70px;
      height: 70px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      font-size: 1.8rem;
      color: white;
    }
    
    .card-content {
      flex: 1;
    }
    
    .card-content h3 {
      font-size: 1.3rem;
      color: #2c3e50;
      margin: 0 0 8px 0;
      font-weight: 600;
    }
    
    .card-content p {
      color: #7f8c8d;
      margin: 0;
      line-height: 1.5;
    }
    
    .card-arrow {
      color: #667eea;
      font-size: 1.2rem;
      transition: transform 0.3s;
    }
    
    .action-card:hover .card-arrow {
      transform: translateX(5px);
    }
    
    @media (max-width: 768px) {
      .dashboard-header h1 {
        font-size: 2rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  totalUsers = 156;
  activeUsers = 142;
  pendingUsers = 8;
  blockedUsers = 6;

  constructor(private router: Router) {}

  navigateToUsers() {
    this.router.navigate(['/users']);
  }

  navigateToReports() {
    // Implement reports navigation
    console.log('Navigate to reports');
  }

  navigateToSettings() {
    // Implement settings navigation
    console.log('Navigate to settings');
  }
}



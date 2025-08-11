import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IntegratedAccountService, DashboardSummary } from '../../services/integrated-account.service';

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
      
      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <span>Loading dashboard data...</span>
      </div>

      <div *ngIf="!loading && dashboardData">
        <!-- User Statistics -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon users">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardData.totalUsers }}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon active">
              <i class="fas fa-user-check"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardData.activeUsers }}</h3>
              <p>Active Users</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon pending">
              <i class="fas fa-user-clock"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardData.pendingUsers }}</h3>
              <p>Pending Users</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon blocked">
              <i class="fas fa-user-lock"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardData.blockedUsers }}</h3>
              <p>Blocked Users</p>
            </div>
          </div>
        </div>
        
        <!-- Account Statistics -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon accounts">
              <i class="fas fa-building"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardData.totalAccounts }}</h3>
              <p>Total Accounts</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon active-accounts">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardData.activeAccounts }}</h3>
              <p>Active Accounts</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon disabled-accounts">
              <i class="fas fa-ban"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardData.disabledAccounts }}</h3>
              <p>Disabled Accounts</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon trade-accounts">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardData.accountsWithTrade }}</h3>
              <p>Trade Accounts</p>
            </div>
          </div>
        </div>

        <!-- Visual Charts Section -->
        <div class="charts-section">
          <div class="chart-container">
            <h3>User Distribution</h3>
            <div class="progress-chart">
              <div class="progress-item">
                <div class="progress-info">
                  <span class="progress-label">Active Users</span>
                  <span class="progress-value">{{ dashboardData.activeUsers }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill active-fill" 
                       [style.width.%]="getPercentage(dashboardData.activeUsers, dashboardData.totalUsers)"></div>
                </div>
              </div>
              <div class="progress-item">
                <div class="progress-info">
                  <span class="progress-label">Pending Users</span>
                  <span class="progress-value">{{ dashboardData.pendingUsers }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill pending-fill" 
                       [style.width.%]="getPercentage(dashboardData.pendingUsers, dashboardData.totalUsers)"></div>
                </div>
              </div>
              <div class="progress-item">
                <div class="progress-info">
                  <span class="progress-label">Blocked Users</span>
                  <span class="progress-value">{{ dashboardData.blockedUsers }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill blocked-fill" 
                       [style.width.%]="getPercentage(dashboardData.blockedUsers, dashboardData.totalUsers)"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chart-container">
            <h3>Account Status</h3>
            <div class="progress-chart">
              <div class="progress-item">
                <div class="progress-info">
                  <span class="progress-label">Active Accounts</span>
                  <span class="progress-value">{{ dashboardData.activeAccounts }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill active-accounts-fill" 
                       [style.width.%]="getPercentage(dashboardData.activeAccounts, dashboardData.totalAccounts)"></div>
                </div>
              </div>
              <div class="progress-item">
                <div class="progress-info">
                  <span class="progress-label">Disabled Accounts</span>
                  <span class="progress-value">{{ dashboardData.disabledAccounts }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill disabled-accounts-fill" 
                       [style.width.%]="getPercentage(dashboardData.disabledAccounts, dashboardData.totalAccounts)"></div>
                </div>
              </div>
              <div class="progress-item">
                <div class="progress-info">
                  <span class="progress-label">Trade Accounts</span>
                  <span class="progress-value">{{ dashboardData.accountsWithTrade }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill trade-accounts-fill" 
                       [style.width.%]="getPercentage(dashboardData.accountsWithTrade, dashboardData.totalAccounts)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-cards" *ngIf="!loading">
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
        
        <div class="action-card" (click)="navigateToAccounts()">
          <div class="card-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="card-content">
            <h3>Account Management</h3>
            <p>Manage user accounts and client information</p>
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
      padding: 20px;
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #7f8c8d;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
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
    .stat-icon.accounts { background: linear-gradient(135deg, #fa709a, #fee140); }
    .stat-icon.active-accounts { background: linear-gradient(135deg, #a8edea, #fed6e3); }
    .stat-icon.disabled-accounts { background: linear-gradient(135deg, #ff9a9e, #fecfef); }
    .stat-icon.trade-accounts { background: linear-gradient(135deg, #ffecd2, #fcb69f); }
    
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

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }

    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .chart-container h3 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .progress-chart {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .progress-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-label {
      color: #2c3e50;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .progress-value {
      color: #667eea;
      font-weight: bold;
      font-size: 1rem;
    }

    .progress-bar {
      height: 8px;
      background-color: #f8f9fa;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 1s ease-in-out;
    }

    .active-fill { background: linear-gradient(90deg, #f093fb, #f5576c); }
    .pending-fill { background: linear-gradient(90deg, #4facfe, #00f2fe); }
    .blocked-fill { background: linear-gradient(90deg, #43e97b, #38f9d7); }
    .active-accounts-fill { background: linear-gradient(90deg, #a8edea, #fed6e3); }
    .disabled-accounts-fill { background: linear-gradient(90deg, #ff9a9e, #fecfef); }
    .trade-accounts-fill { background: linear-gradient(90deg, #ffecd2, #fcb69f); }
    
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
      
      .charts-section {
        grid-template-columns: 1fr;
      }
      
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardSummary | null = null;
  loading = false;

  constructor(
    private router: Router,
    private integratedAccountService: IntegratedAccountService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.integratedAccountService.getDashboardSummary().subscribe({
      next: (data) => {
        console.log('Dashboard data loaded:', data);
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  navigateToUsers() {
    this.router.navigate(['/users']);
  }

  navigateToAccounts() {
    this.router.navigate(['/accounts']);
  }

  navigateToReports() {
    // Implement reports navigation
    console.log('Navigate to reports');
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }
}

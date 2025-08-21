import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { IntegratedAccountService, DashboardSummary } from '../../services/integrated-account.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardSummary | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private integratedAccountService: IntegratedAccountService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.error = null;
    
    // Use real API service
    this.integratedAccountService.getDashboardSummary().subscribe({
      next: (data: DashboardSummary) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Failed to load dashboard data. Please try again.';
        this.loading = false;
      }
    });
  }

  refreshData() {
    this.loadDashboardData();
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
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

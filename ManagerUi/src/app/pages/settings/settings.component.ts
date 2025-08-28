import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings-container">
      <div class="header">
        <h1>Settings</h1>
      </div>

      <div class="content">
        <div class="settings-card">
          <div class="settings-info">
            <h2>Application Settings</h2>
            <p>Configure application preferences, security settings, and system configurations.</p>
          </div>
        </div>

        <div class="settings-card">
          <div class="settings-info">
            <h2>Security Settings</h2>
            <p>Manage user roles, permissions, and authentication methods.</p>
          </div>
        </div>

        <div class="settings-card">
          <div class="settings-info">
            <h2>System Configurations</h2>
            <p>Adjust system preferences and monitor application performance.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
      text-align: center;
    }

    .header h1 {
      color: #1f2937;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
    }

    .content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .settings-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .settings-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    }

    .settings-info h2 {
      color: #374151;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .settings-info p {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 10px;
    }
  `]
})
export class SettingsComponent {}
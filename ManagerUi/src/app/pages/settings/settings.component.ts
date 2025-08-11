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
            <p>This is a placeholder for the settings page.</p>
            <p>Here you can configure application preferences, security settings, and system configurations.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 20px;
    }
    
    .header {
      margin-bottom: 30px;
    }
    
    .header h1 {
      color: #1f2937;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
    }
    
    .settings-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
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
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExternalAuthService, ExternalUserRequest } from '../../../services/external-auth.service';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-create-external-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <clr-form>
      <clr-modal [(clrModalOpen)]="isSubmitting" [clrModalClosable]="false">
        <h3 class="modal-title">Creating User...</h3>
        <div class="modal-body">
          <clr-spinner clrInline></clr-spinner>
        </div>
      </clr-modal>

      <div class="page-header">
        <h1>Create External User</h1>
        <p>Grant external access to collaborate with your organization</p>
      </div>

      <clr-alert *ngIf="errorMessage" clrAlertType="danger">
        <clr-alert-item>
          <span class="alert-text">{{ errorMessage }}</span>
        </clr-alert-item>
      </clr-alert>

      <clr-alert *ngIf="successMessage" clrAlertType="success">
        <clr-alert-item>
          <span class="alert-text">{{ successMessage }}</span>
        </clr-alert-item>
      </clr-alert>

      <clr-form>
        <clr-input-container>
          <label for="firstname">First Name *</label>
          <input clrInput id="firstname" name="firstname" [(ngModel)]="userRequest.firstname" required />
          <clr-control-error>First name is required</clr-control-error>
        </clr-input-container>

        <clr-input-container>
          <label for="lastname">Last Name *</label>
          <input clrInput id="lastname" name="lastname" [(ngModel)]="userRequest.lastname" required />
          <clr-control-error>Last name is required</clr-control-error>
        </clr-input-container>

        <clr-input-container>
          <label for="email">Email Address *</label>
          <input clrInput type="email" id="email" name="email" [(ngModel)]="userRequest.email" required email />
          <clr-control-error>Email is required and must be valid</clr-control-error>
        </clr-input-container>

        <clr-input-container>
          <label for="department">Department</label>
          <input clrInput id="department" name="department" [(ngModel)]="userRequest.department" />
        </clr-input-container>

        <clr-input-container>
          <label for="position">Position</label>
          <input clrInput id="position" name="position" [(ngModel)]="userRequest.position" />
        </clr-input-container>

        <div class="form-actions">
          <button clrButton type="button" (click)="cancel()" class="btn-secondary">Cancel</button>
          <button clrButton type="submit" [disabled]="isSubmitting" class="btn-primary">Create External User</button>
        </div>
      </clr-form>
    </clr-form>
  `,
  styles: [`
    .page-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }

    .btn-primary {
      width: 100%;
      padding: 1rem var(--space-lg);
      font-size: 0.9375rem;
      font-weight: 600;
      border-radius: var(--radius-md);
      border: none;
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
    }

    .btn-primary:disabled {
      background: var(--text-light);
      cursor: not-allowed;
      transform: none;
      box-shadow: var(--shadow-sm);
    }

    .btn-secondary {
      background-color: #6c757d;
      border-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
      border-color: #545b62;
    }
  `]
})
export class CreateExternalUserComponent {
  userRequest: ExternalUserRequest = {
    firstname: '',
    lastname: '',
    email: '',
    department: '',
    position: ''
  };
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private externalAuthService: ExternalAuthService,
    private router: Router
  ) {}

  createUser() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.externalAuthService.createExternalUser(this.userRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = response;

        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error || 'Failed to create external user. Please try again.';
      }
    });
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
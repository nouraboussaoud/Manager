import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { KeycloakUserService } from '../../../services/keycloak-user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ClarityModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  loading = true;
  searchQuery = '';
  selectedUser: any | null = null;
  confirmModal = false;

  constructor(
    private keycloakUserService: KeycloakUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.keycloakUserService.getAllUsers().subscribe({
      next: (data) => {
        // Transform Keycloak UserRepresentation to our format
        this.users = data.map((ku: any) => ({
          id: ku.id,
          firstName: ku.firstName,
          lastName: ku.lastName,
          email: ku.email,
          enabled: ku.enabled,
          username: ku.username,
          attributes: ku.attributes
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users from Keycloak:', err);
        this.loading = false;
      }
    });
  }

  searchUsers(): void {
    if (!this.searchQuery.trim()) {
      this.loadUsers();
      return;
    }

    this.loading = true;
    this.keycloakUserService.searchUsers(this.searchQuery).subscribe({
      next: (data) => {
        this.users = data.map((ku: any) => ({
          id: ku.id,
          firstName: ku.firstName,
          lastName: ku.lastName,
          email: ku.email,
          enabled: ku.enabled,
          username: ku.username,
          attributes: ku.attributes
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error searching users in Keycloak:', err);
        this.loading = false;
      }
    });
  }

  toggleUserStatus(user: any): void {
    const newStatus = !user.enabled;
    
    this.keycloakUserService.setUserStatus(user.id!, newStatus).subscribe({
      next: () => {
        user.enabled = newStatus;
      },
      error: (err) => {
        console.error('Error updating user status in Keycloak:', err);
      }
    });
  }
}



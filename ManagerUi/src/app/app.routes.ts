import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { ExternalLoginComponent } from './pages/external-login/external-login.component';
import { ExternalDashboardComponent } from './pages/external-dashboard/external-dashboard.component';
import { CreateExternalUserComponent } from './pages/external-users/create-external-user/create-external-user.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  
  // External user routes
  { path: 'external-login', component: ExternalLoginComponent },
  { path: 'external-dashboard', component: ExternalDashboardComponent },
  { path: 'create-external-user', component: CreateExternalUserComponent },
  
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'accounts',
        loadComponent: () => import('./pages/accounts/accounts.component').then(m => m.AccountsComponent)
      },
      {
        path: 'account-management',
        loadComponent: () => import('./pages/account-management/account-management.component').then(m => m.AccountManagementComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface ExternalUserRequest {
  firstname: string;
  lastname: string;
  email: string;
  department?: string;
  position?: string;
}

export interface ExternalAuthRequest {
  email: string;
  password: string;
}

export interface ExternalAuthResponse {
  accessToken: string;
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  requiresPasswordChange: boolean;
}

export interface EmailRequest {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExternalAuthService {
  private apiUrl = 'http://localhost:9090/api/v1/external-auth';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('external_token'));
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // Load user data if token exists
    const token = localStorage.getItem('external_token');
    const userData = localStorage.getItem('external_user');
    if (token && userData) {
      this.userSubject.next(JSON.parse(userData));
    }
  }

  createExternalUser(request: ExternalUserRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/create-user`, request, {
      responseType: 'text' as 'json'
    });
  }

  loginExternal(request: ExternalAuthRequest): Observable<ExternalAuthResponse> {
    return this.http.post<ExternalAuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response: ExternalAuthResponse) => {
        if (response.accessToken) {
          localStorage.setItem('external_token', response.accessToken);
          localStorage.setItem('external_user', JSON.stringify(response));
          this.tokenSubject.next(response.accessToken);
          this.userSubject.next(response);
        }
      })
    );
  }

  forgotPassword(request: EmailRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/forgot-password`, request, {
      responseType: 'text' as 'json'
    });
  }

  logout(): void {
    localStorage.removeItem('external_token');
    localStorage.removeItem('external_user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  isExternalAuthenticated(): boolean {
    return !!localStorage.getItem('external_token');
  }

  getExternalToken(): string | null {
    return localStorage.getItem('external_token');
  }

  getCurrentExternalUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  getExternalUserData(): any {
    const userData = localStorage.getItem('external_user');
    return userData ? JSON.parse(userData) : null;
  }
}
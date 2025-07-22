import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface KeycloakUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  enabled: boolean;
  attributes?: Record<string, string[]>;
  password?: string;
  birthdate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakUserService {
  private apiUrl = 'http://localhost:9090/api/v1/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<KeycloakUser[]> {
    return this.http.get<KeycloakUser[]>(this.apiUrl);
  }

  getUserById(userId: string): Observable<KeycloakUser> {
    return this.http.get<KeycloakUser>(`${this.apiUrl}/${userId}`);
  }

  createUser(user: KeycloakUser): Observable<string> {
    return this.http.post<string>(this.apiUrl, user);
  }

  updateUser(userId: string, user: KeycloakUser): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}`, user);
  }

  setUserStatus(userId: string, enabled: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}/status?enabled=${enabled}`, {});
  }

  searchUsers(query: string): Observable<KeycloakUser[]> {
    return this.http.get<KeycloakUser[]>(`${this.apiUrl}/search?query=${query}`);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
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
export class UserService {
  private apiUrl = 'http://localhost:9090/api/v1/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  createUser(user: User): Observable<string> {
    const keycloakUser = {
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      password: user.password,
      enabled: user.enabled,
      birthdate: user.birthdate
    };
    return this.http.post<string>(this.apiUrl, keycloakUser);
  }

  updateUser(userId: string, user: User): Observable<void> {
    const keycloakUser = {
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      enabled: user.enabled,
      birthdate: user.birthdate
    };
    return this.http.put<void>(`${this.apiUrl}/${userId}`, keycloakUser);
  }

  setUserStatus(userId: string, enabled: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}/status?enabled=${enabled}`, {});
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?query=${query}`);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
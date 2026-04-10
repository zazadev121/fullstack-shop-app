import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginDTO, RegisterDTO, VerifyEmailDTO, ResetPassDTO, AuthResponse } from '../models/auth.dto';
import { Result } from '../models/result.model';
import { Observable, tap } from 'rxjs';
import { User, UserRoles } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  
  // Minimal state management
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  register(data: RegisterDTO): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/Register`, data);
  }

  login(data: LoginDTO): Observable<Result<any>> {
    return this.http.post<Result<any>>(`${this.apiUrl}/Login`, data).pipe(
      tap(res => {
        if (res.statusCode === 200 && res.data) {
          // Assuming the token is in res.data or res.data.token depending on backend implementation
          // If backend returns just the token string in data:
          const token = typeof res.data === 'string' ? res.data : res.data.token;
          if (token) {
             localStorage.setItem('jwt', token);
             this.loadUserFromToken();
          }
        }
      })
    );
  }

  verifyEmail(data: VerifyEmailDTO): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/VerifyEmail`, data).pipe(
      tap(res => {
        if (res.statusCode === 200 && res.data) {
          localStorage.setItem('jwt', res.data);
          this.loadUserFromToken();
        }
      })
    );
  }

  forgotPassword(email: string): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/ForgotPassword/${email}`, {});
  }

  resetPassword(data: ResetPassDTO): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/ResetPassword`, data);
  }

  logout() {
    localStorage.removeItem('jwt');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  private loadUserFromToken() {
    const token = this.getToken();
    if (!token) return;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return;
      const payload = JSON.parse(atob(parts[1]));
      
      const user: User = {
        id: Number(payload['UserId'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']),
        name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload['Name'],
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload['Email'],
        isVerified: true, 
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' ? UserRoles.Admin : UserRoles.User
      };
      
      this.currentUser.set(user);
    } catch (e) {
      console.error('Error parsing token', e);
      this.logout();
    }
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === UserRoles.Admin;
  }
}

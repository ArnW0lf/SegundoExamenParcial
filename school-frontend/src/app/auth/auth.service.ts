import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginResponse {
  access: string;
  refresh?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Cambia el puerto si tu backend está en otro puerto
  private readonly API_URL = 'http://localhost:8000/api';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    // Asegúrate que esta URL coincida con tu endpoint de backend
    return this.http.post<LoginResponse>(`${this.API_URL}/token/`, {
      username: username,
      password: password
    }).pipe(
      tap(response => {
        if (response && response.access) {
          localStorage.setItem('token', response.access);
          this.currentUserSubject.next(response); // Actualiza el usuario actual
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error(error.error?.detail || 'Error en el servidor'));
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user && user.roles && user.roles.includes(role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Aquí puedes agregar métodos para login y actualizar el usuario...
}

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
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error(error.error?.detail || 'Error en el servidor'));
      })
    );
  }
}

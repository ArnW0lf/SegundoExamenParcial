import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
}

export interface User {
  username: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Cambia el puerto si tu backend está en otro puerto
  private readonly API_URL = 'http://localhost:8000/api';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Intentar recuperar el usuario del localStorage al iniciar el servicio
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error al cargar usuario almacenado:', error);
        this.logout();
      }
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/token/`, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          try {
            // Crear un usuario con el token recibido
            const user: User = {
              username: username,
              role: 'ADMIN', // Por ahora asumimos que es admin, esto debería venir del backend
              token: response.token
            };

            // Guardar en localStorage
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));

            // Actualizar el estado
            this.currentUserSubject.next(user);

            console.log('Usuario autenticado:', user);
          } catch (error) {
            console.error('Error al procesar el token:', error);
            this.logout();
            throw new Error('Error al procesar el token');
          }
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error(error.error?.detail || 'Error en el servidor'));
      })
    );
  }

  isLoggedIn(): boolean {
    const user = this.currentUserSubject.value;
    const token = this.getToken();

    if (!user || !token) {
      console.log('isLoggedIn: No hay usuario o token');
      return false;
    }

    // Verificar que el token almacenado coincida con el del usuario
    if (user.token !== token) {
      console.log('isLoggedIn: Token no coincide');
      return false;
    }

    return true;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Aquí puedes agregar métodos para login y actualizar el usuario...
}

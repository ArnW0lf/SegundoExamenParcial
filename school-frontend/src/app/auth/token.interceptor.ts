import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // No interceptar la petición de login
  if (req.url.includes('/token/')) {
    return next(req);
  }

  const token = authService.getToken();

  if (!token) {
    console.log('Interceptor: No hay token disponible');
    router.navigate(['/login']);
    return throwError(() => new Error('No token available'));
  }

  // Verificar si el usuario está autenticado
  if (!authService.isLoggedIn()) {
    console.log('Interceptor: Usuario no autenticado');
    authService.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('User not authenticated'));
  }

  req = req.clone({
    setHeaders: {
      Authorization: `Token ${token}`
    }
  });

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Interceptor: Error 401 - Token inválido');
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}; 
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('AuthGuard - isLoggedIn:', isLoggedIn);

    if (!isLoggedIn) {
      console.log('AuthGuard - Redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }

    const currentUser = this.authService.getCurrentUser();
    console.log('AuthGuard - currentUser:', currentUser);

    if (!currentUser) {
      console.log('AuthGuard - No hay usuario actual, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

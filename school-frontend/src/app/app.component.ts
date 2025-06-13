import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, LoginComponent],
  template: `
    <ng-container *ngIf="!(authService.isLoggedIn()); else mainLayout">
      <app-login></app-login>
    </ng-container>
    <ng-template #mainLayout>
      <app-main-layout></app-main-layout>
    </ng-template>
  `
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Verificar el estado de autenticación al iniciar la aplicación
    if (this.authService.isLoggedIn()) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }
  }
} 
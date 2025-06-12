import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, LoginComponent],
  template: `
    <ng-container *ngIf="!(authService.currentUser$ | async); else mainLayout">
      <app-login></app-login>
    </ng-container>
    <ng-template #mainLayout>
      <app-main-layout></app-main-layout>
    </ng-template>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {}
} 
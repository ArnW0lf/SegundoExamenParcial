import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <div class="layout-container">
      <mat-toolbar color="primary" class="toolbar">
        <a mat-button routerLink="/dashboard" class="brand">
          <mat-icon>school</mat-icon>
          <span>School Management</span>
        </a>

        <!-- Menú principal -->
        <div class="nav-links">
          <!-- Menú para Administrador -->
          <ng-container *ngIf="isAdmin">
            <a mat-button routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>home</mat-icon>
              Inicio
            </a>
            <a mat-button routerLink="/students" routerLinkActive="active">
              <mat-icon>people</mat-icon>
              Estudiantes
            </a>
            <a mat-button routerLink="/teachers" routerLinkActive="active">
              <mat-icon>person</mat-icon>
              Profesores
            </a>
            <a mat-button routerLink="/subjects" routerLinkActive="active">
              <mat-icon>book</mat-icon>
              Materias
            </a>
            <a mat-button routerLink="/grades" routerLinkActive="active">
              <mat-icon>grade</mat-icon>
              Grados
            </a>
          </ng-container>

          <!-- Menú para Profesor -->
          <ng-container *ngIf="isTeacher">
            <a mat-button routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>home</mat-icon>
              Inicio
            </a>
            <a mat-button routerLink="/my-subjects" routerLinkActive="active">
              <mat-icon>book</mat-icon>
              Mis Materias
            </a>
            <a mat-button routerLink="/my-students" routerLinkActive="active">
              <mat-icon>people</mat-icon>
              Mis Estudiantes
            </a>
          </ng-container>

          <!-- Menú para Estudiante -->
          <ng-container *ngIf="isStudent">
            <a mat-button routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>home</mat-icon>
              Inicio
            </a>
            <a mat-button routerLink="/my-courses" routerLinkActive="active">
              <mat-icon>book</mat-icon>
              Mis Cursos
            </a>
            <a mat-button routerLink="/my-grades" routerLinkActive="active">
              <mat-icon>grade</mat-icon>
              Mis Calificaciones
            </a>
            <a mat-button routerLink="/my-attendance" routerLinkActive="active">
              <mat-icon>event_note</mat-icon>
              Mi Asistencia
            </a>
          </ng-container>

          <!-- Menú para Padre -->
          <ng-container *ngIf="isParent">
            <a mat-button routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>home</mat-icon>
              Inicio
            </a>
            <a mat-button routerLink="/my-children" routerLinkActive="active">
              <mat-icon>child_care</mat-icon>
              Mis Hijos
            </a>
            <a mat-button routerLink="/children-grades" routerLinkActive="active">
              <mat-icon>grade</mat-icon>
              Calificaciones
            </a>
            <a mat-button routerLink="/children-attendance" routerLinkActive="active">
              <mat-icon>event_note</mat-icon>
              Asistencia
            </a>
          </ng-container>
        </div>

        <span class="spacer"></span>

        <!-- Perfil y logout -->
        <div class="user-actions">
          <span class="user-info" *ngIf="userRole">
            <mat-icon>person</mat-icon>
            {{userRole}}
          </span>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Cerrar sesión</span>
            </button>
          </mat-menu>
        </div>
      </mat-toolbar>

      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      text-decoration: none;
      color: white;
    }
    .nav-links {
      margin-left: 16px;
      display: flex;
      align-items: center;
    }
    .nav-links a {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 16px;
      height: 64px;
      color: white;
      text-decoration: none;
    }
    .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: white;
    }
    .content {
      margin-top: 64px;
      padding: 20px;
      flex: 1;
      overflow-y: auto;
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;
  userRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userRole = user.role;
        this.isAdmin = user.role === 'ADMIN';
        this.isTeacher = user.role === 'TEACHER';
        this.isStudent = user.role === 'STUDENT';
        this.isParent = user.role === 'PARENT';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
} 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="home-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Bienvenido al Sistema de Gestión Escolar</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Este sistema te permite gestionar:</p>
          <ul>
            <li>Estudiantes</li>
            <li>Profesores</li>
            <li>Materias</li>
            <li>Calificaciones</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    mat-card {
      margin-bottom: 20px;
    }
    ul {
      list-style-type: none;
      padding-left: 20px;
    }
    li {
      margin: 10px 0;
      font-size: 16px;
    }
  `],
  imports: [CommonModule, MatCardModule]
})
export class HomeComponent {} 
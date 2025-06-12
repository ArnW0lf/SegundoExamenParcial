import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="courses-container">
      <h2>Mis Cursos</h2>
      
      <div class="courses-grid">
        <mat-card *ngFor="let course of courses" class="course-card">
          <mat-card-header>
            <mat-card-title>{{ course.name }}</mat-card-title>
            <mat-card-subtitle>{{ course.teacher }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p><strong>Código:</strong> {{ course.code }}</p>
            <p><strong>Horario:</strong> {{ course.schedule }}</p>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="primary">
              <mat-icon>assignment</mat-icon>
              Ver Detalles
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .courses-container {
      padding: 20px;
    }
    
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .course-card {
      margin-bottom: 20px;
    }
    
    mat-card-actions {
      padding: 16px;
    }
  `]
})
export class MyCoursesComponent implements OnInit {
  courses: any[] = [
    {
      name: 'Matemáticas',
      teacher: 'Prof. Juan Pérez',
      code: 'MAT101',
      schedule: 'Lunes y Miércoles 9:00 - 10:30'
    },
    {
      name: 'Literatura',
      teacher: 'Prof. María García',
      code: 'LIT201',
      schedule: 'Martes y Jueves 11:00 - 12:30'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Aquí cargaremos los cursos del estudiante desde el backend
  }
} 
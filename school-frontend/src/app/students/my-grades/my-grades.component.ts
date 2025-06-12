import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-my-grades',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="grades-container">
      <h2>Mis Calificaciones</h2>

      <div class="grades-content">
        <mat-card *ngFor="let subject of subjects" class="subject-card">
          <mat-card-header>
            <mat-card-title>{{ subject.name }}</mat-card-title>
            <mat-card-subtitle>{{ subject.teacher }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <table mat-table [dataSource]="subject.grades" class="grades-table">
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let grade">{{ grade.date | date }}</td>
              </ng-container>

              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let grade">{{ grade.description }}</td>
              </ng-container>

              <ng-container matColumnDef="grade">
                <th mat-header-cell *matHeaderCellDef>Nota</th>
                <td mat-cell *matCellDef="let grade">{{ grade.grade }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="average-container">
              <strong>Promedio: {{ subject.average }}/100</strong>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .grades-container {
      padding: 20px;
    }

    .grades-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .subject-card {
      margin-bottom: 20px;
    }

    .grades-table {
      width: 100%;
      margin-top: 16px;
    }

    .average-container {
      margin-top: 16px;
      text-align: right;
      font-size: 1.1em;
    }

    th.mat-header-cell {
      font-weight: bold;
    }
  `]
})
export class MyGradesComponent implements OnInit {
  displayedColumns: string[] = ['date', 'description', 'grade'];
  
  subjects = [
    {
      name: 'Matemáticas',
      teacher: 'Prof. Juan Pérez',
      average: 85,
      grades: [
        { date: new Date(), description: 'Examen Parcial 1', grade: 85 },
        { date: new Date(), description: 'Tarea 1', grade: 90 },
        { date: new Date(), description: 'Proyecto', grade: 80 }
      ]
    },
    {
      name: 'Literatura',
      teacher: 'Prof. María García',
      average: 88,
      grades: [
        { date: new Date(), description: 'Ensayo', grade: 88 },
        { date: new Date(), description: 'Presentación', grade: 92 },
        { date: new Date(), description: 'Examen Final', grade: 85 }
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Aquí cargaremos las calificaciones del estudiante desde el backend
  }
} 
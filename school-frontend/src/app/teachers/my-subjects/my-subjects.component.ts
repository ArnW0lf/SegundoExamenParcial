import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterModule,
    MatSnackBarModule
  ],
  template: `
    <div class="subjects-container">
      <h2>Mis Materias</h2>

      <div class="subjects-grid">
        <mat-card *ngFor="let subject of subjects" class="subject-card">
          <mat-card-header>
            <mat-card-title>{{ subject.name }}</mat-card-title>
            <mat-card-subtitle>Código: {{ subject.code }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p><strong>Grado:</strong> {{ subject.grade }}</p>
            <p><strong>Horario:</strong> {{ subject.schedule }}</p>
            <p><strong>Estudiantes:</strong> {{ subject.studentCount }}</p>

            <table mat-table [dataSource]="subject.nextClasses" class="schedule-table">
              <ng-container matColumnDef="day">
                <th mat-header-cell *matHeaderCellDef>Día</th>
                <td mat-cell *matCellDef="let class">{{ class.day }}</td>
              </ng-container>

              <ng-container matColumnDef="time">
                <th mat-header-cell *matHeaderCellDef>Hora</th>
                <td mat-cell *matCellDef="let class">{{ class.time }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button color="primary" (click)="navigateToGrades(subject)">
              <mat-icon>grade</mat-icon>
              Calificaciones
            </button>
            <button mat-button color="accent" (click)="navigateToAttendance(subject)">
              <mat-icon>event_note</mat-icon>
              Asistencia
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .subjects-container {
      padding: 20px;
    }

    .subjects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .subject-card {
      margin-bottom: 20px;
    }

    .schedule-table {
      width: 100%;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-around;
      padding: 16px;
    }

    th.mat-header-cell {
      font-weight: bold;
    }
  `]
})
export class MySubjectsComponent implements OnInit {
  displayedColumns: string[] = ['day', 'time'];
  subjects: any[] = [];

  constructor(
    private teacherService: TeacherService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.teacherService.getMySubjects().subscribe({
      next: (data) => {
        this.subjects = data;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar las materias', 'Cerrar', {
          duration: 3000
        });
        console.error('Error loading subjects:', error);
      }
    });
  }

  navigateToGrades(subject: any): void {
    // Aquí puedes implementar la navegación a la vista de calificaciones
    console.log('Navegando a calificaciones de:', subject.name);
  }

  navigateToAttendance(subject: any): void {
    // Aquí puedes implementar la navegación a la vista de asistencia
    console.log('Navegando a asistencia de:', subject.name);
  }
} 
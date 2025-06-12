import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="attendance-container">
      <h2>Mi Asistencia</h2>

      <div class="attendance-content">
        <mat-card *ngFor="let subject of subjects" class="subject-card">
          <mat-card-header>
            <mat-card-title>{{ subject.name }}</mat-card-title>
            <mat-card-subtitle>{{ subject.teacher }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <table mat-table [dataSource]="subject.attendance" class="attendance-table">
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let record">{{ record.date | date }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let record">
                  <mat-icon [ngStyle]="{'color': getStatusColor(record.status)}">
                    {{ getStatusIcon(record.status) }}
                  </mat-icon>
                  {{ getStatusText(record.status) }}
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="stats-container">
              <p><strong>Asistencia Total:</strong> {{ subject.attendanceRate }}%</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .attendance-container {
      padding: 20px;
    }

    .attendance-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .subject-card {
      margin-bottom: 20px;
    }

    .attendance-table {
      width: 100%;
      margin-top: 16px;
    }

    .stats-container {
      margin-top: 16px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    mat-icon {
      vertical-align: middle;
      margin-right: 8px;
    }

    th.mat-header-cell {
      font-weight: bold;
    }
  `]
})
export class MyAttendanceComponent implements OnInit {
  displayedColumns: string[] = ['date', 'status'];
  
  subjects = [
    {
      name: 'Matemáticas',
      teacher: 'Prof. Juan Pérez',
      attendanceRate: 90,
      attendance: [
        { date: new Date(), status: 'P' },
        { date: new Date(Date.now() - 86400000), status: 'P' },
        { date: new Date(Date.now() - 172800000), status: 'A' }
      ]
    },
    {
      name: 'Literatura',
      teacher: 'Prof. María García',
      attendanceRate: 95,
      attendance: [
        { date: new Date(), status: 'P' },
        { date: new Date(Date.now() - 86400000), status: 'P' },
        { date: new Date(Date.now() - 172800000), status: 'J' }
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Aquí cargaremos la asistencia del estudiante desde el backend
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'P': return 'green';
      case 'A': return 'red';
      case 'J': return 'orange';
      default: return 'black';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'P': return 'check_circle';
      case 'A': return 'cancel';
      case 'J': return 'warning';
      default: return 'help';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'P': return 'Presente';
      case 'A': return 'Ausente';
      case 'J': return 'Justificado';
      default: return 'Desconocido';
    }
  }
} 
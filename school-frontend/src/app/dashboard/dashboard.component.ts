import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dashboard-container">
      <h2>Dashboard</h2>

      <div class="stats-cards">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <h2>Total de Alumnos</h2>
                <div class="stat-value">{{totalStudents}}</div>
              </div>
              <mat-icon class="stat-icon">school</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <h2>Promedio General</h2>
                <div class="stat-value">{{averageGrade.toFixed(1)}}</div>
              </div>
              <mat-icon class="stat-icon">grade</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <h2>Asistencia Promedio</h2>
                <div class="stat-value">{{(attendanceRate * 100).toFixed(1)}}%</div>
              </div>
              <mat-icon class="stat-icon">event_available</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="charts-container">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Rendimiento por Materias</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas id="subjectsChart"></canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Distribución de Asistencia</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas id="attendanceChart"></canvas>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="subjects-performance-card">
        <mat-card-header>
          <mat-card-title>Rendimiento por Materias</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="subjectsData" class="subjects-table">
            <ng-container matColumnDef="subject">
              <th mat-header-cell *matHeaderCellDef>Materia</th>
              <td mat-cell *matCellDef="let item">{{item.name}}</td>
            </ng-container>

            <ng-container matColumnDef="average">
              <th mat-header-cell *matHeaderCellDef>Promedio</th>
              <td mat-cell *matCellDef="let item">{{item.average}}</td>
            </ng-container>

            <ng-container matColumnDef="predicted">
              <th mat-header-cell *matHeaderCellDef>Predicción</th>
              <td mat-cell *matCellDef="let item">{{item.predicted}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .stat-card {
      height: 120px;
    }

    .stat-content {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }

    .stat-info h2 {
      margin: 0;
      font-size: 1.1rem;
      color: rgba(0, 0, 0, 0.7);
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #3f51b5;
      margin-top: 8px;
    }

    .stat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: rgba(63, 81, 181, 0.2);
    }

    .charts-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .chart-card {
      min-height: 400px;
      padding: 16px;
    }

    mat-card-header {
      margin-bottom: 16px;
    }

    .subjects-table {
      width: 100%;
    }

    .subjects-performance-card {
      margin-top: 20px;
    }

    canvas {
      width: 100% !important;
      height: 300px !important;
    }

    .mat-column-subject {
      flex: 2;
    }

    .mat-column-average,
    .mat-column-predicted {
      flex: 1;
      text-align: center;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns = ['subject', 'average', 'predicted'];
  
  // Datos de estadísticas
  totalStudents = 150;
  averageGrade = 8.5;
  attendanceRate = 0.92;

  // Datos de materias
  subjectsData = [
    { name: 'Matemáticas', average: 8.5, predicted: 8.7 },
    { name: 'Historia', average: 7.8, predicted: 8.0 },
    { name: 'Ciencias', average: 8.2, predicted: 8.5 },
    { name: 'Literatura', average: 9.0, predicted: 9.2 },
    { name: 'Inglés', average: 8.7, predicted: 8.9 }
  ];

  constructor(
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.createSubjectsChart();
      this.createAttendanceChart();
    }, 100);
  }

  createSubjectsChart(): void {
    const ctx = document.getElementById('subjectsChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.subjectsData.map(item => item.name),
        datasets: [{
          label: 'Promedio',
          data: this.subjectsData.map(item => item.average),
          backgroundColor: 'rgba(63, 81, 181, 0.7)',
          borderColor: 'rgba(63, 81, 181, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10
          }
        }
      }
    });
  }

  createAttendanceChart(): void {
    const ctx = document.getElementById('attendanceChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Asistencia', 'Faltas Justificadas', 'Faltas Injustificadas'],
        datasets: [{
          data: [92, 5, 3],
          backgroundColor: [
            'rgba(76, 175, 80, 0.7)',
            'rgba(255, 152, 0, 0.7)',
            'rgba(244, 67, 54, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
} 
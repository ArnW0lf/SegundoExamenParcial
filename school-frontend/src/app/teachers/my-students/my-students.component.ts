import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../services/teacher.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="students-container">
      <h2>Mis Estudiantes</h2>

      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field>
              <mat-label>Filtrar por materia</mat-label>
              <mat-select [(ngModel)]="selectedSubject" (selectionChange)="filterStudents()">
                <mat-option [value]="''">Todas</mat-option>
                <mat-option *ngFor="let subject of subjects" [value]="subject.id">
                  {{subject.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Buscar estudiante</mat-label>
              <input matInput [(ngModel)]="searchText" (ngModelChange)="filterStudents()" placeholder="Nombre o apellido">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <table mat-table [dataSource]="filteredStudents" class="students-table">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let student">{{student.id}}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let student">{{student.name}}</td>
        </ng-container>

        <ng-container matColumnDef="grade">
          <th mat-header-cell *matHeaderCellDef>Grado</th>
          <td mat-cell *matCellDef="let student">{{student.grade}}</td>
        </ng-container>

        <ng-container matColumnDef="subjects">
          <th mat-header-cell *matHeaderCellDef>Materias</th>
          <td mat-cell *matCellDef="let student">{{student.subjects.join(', ')}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let student">
            <button mat-icon-button color="primary" (click)="viewGrades(student)" title="Ver calificaciones">
              <mat-icon>grade</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="viewAttendance(student)" title="Ver asistencia">
              <mat-icon>event_note</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="viewDetails(student)" title="Ver detalles">
              <mat-icon>info</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .students-container {
      padding: 20px;
    }

    .filters-card {
      margin-bottom: 20px;
    }

    .filters {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .students-table {
      width: 100%;
    }

    mat-form-field {
      min-width: 200px;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }

    .mat-column-id {
      width: 80px;
    }
  `]
})
export class MyStudentsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'grade', 'subjects', 'actions'];
  selectedSubject: string = '';
  searchText: string = '';
  subjects: any[] = [];
  students: any[] = [];
  filteredStudents: any[] = [];

  constructor(
    private teacherService: TeacherService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
    this.loadStudents();
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

  loadStudents(): void {
    this.teacherService.getMyStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.filterStudents();
      },
      error: (error) => {
        this.snackBar.open('Error al cargar los estudiantes', 'Cerrar', {
          duration: 3000
        });
        console.error('Error loading students:', error);
      }
    });
  }

  filterStudents(): void {
    let filtered = [...this.students];

    if (this.selectedSubject) {
      filtered = filtered.filter(student => 
        student.subjects.some((subject: any) => 
          subject.id === this.selectedSubject
        )
      );
    }

    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchLower)
      );
    }

    this.filteredStudents = filtered;
  }

  viewGrades(student: any): void {
    // Implementar vista de calificaciones
    this.router.navigate(['/grades', student.id]);
  }

  viewAttendance(student: any): void {
    // Implementar vista de asistencia
    this.router.navigate(['/attendance', student.id]);
  }

  viewDetails(student: any): void {
    // Implementar vista de detalles
    this.router.navigate(['/student-details', student.id]);
  }
} 
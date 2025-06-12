import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../services/teacher.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-grade-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="grades-container">
      <h2>Registro de Notas - {{subjectName}}</h2>

      <div class="period-selector">
        <mat-form-field>
          <mat-label>Periodo</mat-label>
          <mat-select [(ngModel)]="selectedPeriod" (selectionChange)="loadGrades()">
            <mat-option *ngFor="let period of periods" [value]="period.id">
              {{period.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="students" class="grades-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Estudiante</th>
          <td mat-cell *matCellDef="let student">{{student.name}}</td>
        </ng-container>

        <ng-container matColumnDef="participation">
          <th mat-header-cell *matHeaderCellDef>Participación (20%)</th>
          <td mat-cell *matCellDef="let student">
            <mat-form-field>
              <input matInput type="number" min="0" max="20" 
                     [(ngModel)]="student.grades.participation"
                     (change)="calculateFinalGrade(student)">
            </mat-form-field>
          </td>
        </ng-container>

        <ng-container matColumnDef="homework">
          <th mat-header-cell *matHeaderCellDef>Tareas (30%)</th>
          <td mat-cell *matCellDef="let student">
            <mat-form-field>
              <input matInput type="number" min="0" max="20" 
                     [(ngModel)]="student.grades.homework"
                     (change)="calculateFinalGrade(student)">
            </mat-form-field>
          </td>
        </ng-container>

        <ng-container matColumnDef="exam">
          <th mat-header-cell *matHeaderCellDef>Examen (50%)</th>
          <td mat-cell *matCellDef="let student">
            <mat-form-field>
              <input matInput type="number" min="0" max="20" 
                     [(ngModel)]="student.grades.exam"
                     (change)="calculateFinalGrade(student)">
            </mat-form-field>
          </td>
        </ng-container>

        <ng-container matColumnDef="finalGrade">
          <th mat-header-cell *matHeaderCellDef>Nota Final</th>
          <td mat-cell *matCellDef="let student">{{student.grades.final | number:'1.0-2'}}</td>
        </ng-container>

        <ng-container matColumnDef="attendance">
          <th mat-header-cell *matHeaderCellDef>Asistencia</th>
          <td mat-cell *matCellDef="let student">{{student.attendance}}%</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div class="actions">
        <button mat-raised-button color="primary" (click)="saveGrades()">
          <mat-icon>save</mat-icon>
          Guardar Notas
        </button>
      </div>
    </div>
  `,
  styles: [`
    .grades-container {
      padding: 20px;
    }

    .period-selector {
      margin-bottom: 20px;
    }

    .grades-table {
      width: 100%;
      margin-bottom: 20px;
    }

    .mat-column-name {
      min-width: 200px;
    }

    .mat-column-participation,
    .mat-column-homework,
    .mat-column-exam,
    .mat-column-finalGrade,
    .mat-column-attendance {
      width: 120px;
      text-align: center;
    }

    mat-form-field {
      width: 70px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }

    input[type=number] {
      text-align: center;
    }
  `]
})
export class GradeManagementComponent implements OnInit {
  displayedColumns = ['name', 'participation', 'homework', 'exam', 'finalGrade', 'attendance'];
  selectedPeriod: string = '';
  subjectId: string = '';
  subjectName: string = '';
  
  periods = [
    { id: '1', name: 'Primer Bimestre' },
    { id: '2', name: 'Segundo Bimestre' },
    { id: '3', name: 'Tercer Bimestre' },
    { id: '4', name: 'Cuarto Bimestre' }
  ];

  students: any[] = [];

  constructor(
    private teacherService: TeacherService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subjectId = this.route.snapshot.params['id'];
    this.loadStudents();
  }

  loadStudents(): void {
    this.teacherService.getStudentsBySubject(this.subjectId).subscribe({
      next: (data) => {
        this.students = data.map((student: any) => ({
          ...student,
          grades: {
            participation: 0,
            homework: 0,
            exam: 0,
            final: 0
          }
        }));
      },
      error: (error) => {
        this.snackBar.open('Error al cargar los estudiantes', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  loadGrades(): void {
    if (!this.selectedPeriod) return;

    this.students.forEach(student => {
      this.teacherService.getStudentGrades(student.id, parseInt(this.subjectId)).subscribe({
        next: (grades) => {
          if (grades && grades.length > 0) {
            student.grades = grades[0];
            this.calculateFinalGrade(student);
          }
        }
      });
    });
  }

  calculateFinalGrade(student: any): void {
    const participation = student.grades.participation * 0.2;
    const homework = student.grades.homework * 0.3;
    const exam = student.grades.exam * 0.5;
    student.grades.final = participation + homework + exam;
  }

  saveGrades(): void {
    const promises = this.students.map(student => {
      return this.teacherService.saveGrade(
        student.id,
        parseInt(this.subjectId),
        {
          period: this.selectedPeriod,
          ...student.grades
        }
      ).toPromise();
    });

    Promise.all(promises)
      .then(() => {
        this.snackBar.open('Notas guardadas exitosamente', 'Cerrar', {
          duration: 3000
        });
      })
      .catch(() => {
        this.snackBar.open('Error al guardar las notas', 'Cerrar', {
          duration: 3000
        });
      });
  }
} 
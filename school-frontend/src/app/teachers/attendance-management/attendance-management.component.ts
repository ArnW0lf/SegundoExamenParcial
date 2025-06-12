import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../services/teacher.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="attendance-container">
      <h2>Registro de Asistencia - {{subjectName}}</h2>

      <div class="date-selector">
        <mat-form-field>
          <mat-label>Fecha</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate" (dateChange)="loadAttendance()">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="students" class="attendance-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Estudiante</th>
          <td mat-cell *matCellDef="let student">{{student.name}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let student">
            <mat-form-field>
              <mat-select [(ngModel)]="student.attendance.status">
                <mat-option value="present">Presente</mat-option>
                <mat-option value="absent">Ausente</mat-option>
                <mat-option value="late">Tardanza</mat-option>
                <mat-option value="justified">Justificado</mat-option>
              </mat-select>
            </mat-form-field>
          </td>
        </ng-container>

        <ng-container matColumnDef="comment">
          <th mat-header-cell *matHeaderCellDef>Observación</th>
          <td mat-cell *matCellDef="let student">
            <mat-form-field>
              <input matInput [(ngModel)]="student.attendance.comment" placeholder="Observación">
            </mat-form-field>
          </td>
        </ng-container>

        <ng-container matColumnDef="attendance">
          <th mat-header-cell *matHeaderCellDef>% Asistencia</th>
          <td mat-cell *matCellDef="let student">{{student.attendancePercentage}}%</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div class="actions">
        <button mat-raised-button color="primary" (click)="saveAttendance()">
          <mat-icon>save</mat-icon>
          Guardar Asistencia
        </button>
      </div>
    </div>
  `,
  styles: [`
    .attendance-container {
      padding: 20px;
    }

    .date-selector {
      margin-bottom: 20px;
    }

    .attendance-table {
      width: 100%;
      margin-bottom: 20px;
    }

    .mat-column-name {
      min-width: 200px;
    }

    .mat-column-status {
      width: 150px;
    }

    .mat-column-comment {
      width: 300px;
    }

    .mat-column-attendance {
      width: 120px;
      text-align: center;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class AttendanceManagementComponent implements OnInit {
  displayedColumns = ['name', 'status', 'comment', 'attendance'];
  selectedDate: Date = new Date();
  subjectId: string = '';
  subjectName: string = '';
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
          attendance: {
            status: 'present',
            comment: ''
          },
          attendancePercentage: 0
        }));
        this.loadAttendance();
      },
      error: (error) => {
        this.snackBar.open('Error al cargar los estudiantes', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  loadAttendance(): void {
    if (!this.selectedDate) return;

    this.students.forEach(student => {
      this.teacherService.getStudentAttendance(student.id, parseInt(this.subjectId)).subscribe({
        next: (attendance) => {
          if (attendance) {
            student.attendance = attendance;
            // Aquí se podría calcular el porcentaje de asistencia
          }
        }
      });
    });
  }

  saveAttendance(): void {
    const promises = this.students.map(student => {
      return this.teacherService.saveAttendance(
        student.id,
        parseInt(this.subjectId),
        {
          date: this.selectedDate,
          ...student.attendance
        }
      ).toPromise();
    });

    Promise.all(promises)
      .then(() => {
        this.snackBar.open('Asistencia guardada exitosamente', 'Cerrar', {
          duration: 3000
        });
      })
      .catch(() => {
        this.snackBar.open('Error al guardar la asistencia', 'Cerrar', {
          duration: 3000
        });
      });
  }
} 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Gestión de Estudiantes</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="students">
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

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let student">
                <button mat-icon-button color="primary" (click)="editStudent(student)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteStudent(student)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="addStudent()">
          <mat-icon>add</mat-icon>
          Agregar Estudiante
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .table-container {
      margin: 20px 0;
      overflow-x: auto;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
    mat-card-actions {
      padding: 16px;
    }
  `]
})
export class StudentListComponent {
  students = [
    { id: 1, name: 'Juan Pérez', grade: '1° A' },
    { id: 2, name: 'María García', grade: '2° B' },
    { id: 3, name: 'Carlos López', grade: '3° A' }
  ];

  displayedColumns = ['id', 'name', 'grade', 'actions'];

  addStudent() {
    // Implementar lógica para agregar estudiante
    console.log('Agregar estudiante');
  }

  editStudent(student: any) {
    // Implementar lógica para editar estudiante
    console.log('Editar estudiante:', student);
  }

  deleteStudent(student: any) {
    // Implementar lógica para eliminar estudiante
    console.log('Eliminar estudiante:', student);
  }
} 
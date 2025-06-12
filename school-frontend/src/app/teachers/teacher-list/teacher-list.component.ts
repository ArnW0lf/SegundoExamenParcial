import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-teacher-list',
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
        <mat-card-title>Gestión de Profesores</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="teachers">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let teacher">{{teacher.id}}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let teacher">{{teacher.name}}</td>
            </ng-container>

            <ng-container matColumnDef="subject">
              <th mat-header-cell *matHeaderCellDef>Materia</th>
              <td mat-cell *matCellDef="let teacher">{{teacher.subject}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let teacher">
                <button mat-icon-button color="primary" (click)="editTeacher(teacher)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteTeacher(teacher)">
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
        <button mat-raised-button color="primary" (click)="addTeacher()">
          <mat-icon>add</mat-icon>
          Agregar Profesor
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
export class TeacherListComponent {
  teachers = [
    { id: 1, name: 'Ana Martínez', subject: 'Matemáticas' },
    { id: 2, name: 'Pedro Rodríguez', subject: 'Historia' },
    { id: 3, name: 'Laura Sánchez', subject: 'Ciencias' }
  ];

  displayedColumns = ['id', 'name', 'subject', 'actions'];

  addTeacher() {
    // Implementar lógica para agregar profesor
    console.log('Agregar profesor');
  }

  editTeacher(teacher: any) {
    // Implementar lógica para editar profesor
    console.log('Editar profesor:', teacher);
  }

  deleteTeacher(teacher: any) {
    // Implementar lógica para eliminar profesor
    console.log('Eliminar profesor:', teacher);
  }
} 
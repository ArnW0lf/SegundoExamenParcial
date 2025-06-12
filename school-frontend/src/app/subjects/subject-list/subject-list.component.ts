import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-subject-list',
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
        <mat-card-title>Gestión de Materias</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="subjects">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let subject">{{subject.id}}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let subject">{{subject.name}}</td>
            </ng-container>

            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef>Grado</th>
              <td mat-cell *matCellDef="let subject">{{subject.grade}}</td>
            </ng-container>

            <ng-container matColumnDef="teacher">
              <th mat-header-cell *matHeaderCellDef>Profesor</th>
              <td mat-cell *matCellDef="let subject">{{subject.teacher}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let subject">
                <button mat-icon-button color="primary" (click)="editSubject(subject)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteSubject(subject)">
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
        <button mat-raised-button color="primary" (click)="addSubject()">
          <mat-icon>add</mat-icon>
          Agregar Materia
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
export class SubjectListComponent {
  subjects = [
    { id: 1, name: 'Matemáticas', grade: '1° A', teacher: 'Ana Martínez' },
    { id: 2, name: 'Historia', grade: '2° B', teacher: 'Pedro Rodríguez' },
    { id: 3, name: 'Ciencias', grade: '3° A', teacher: 'Laura Sánchez' }
  ];

  displayedColumns = ['id', 'name', 'grade', 'teacher', 'actions'];

  addSubject() {
    // Implementar lógica para agregar materia
    console.log('Agregar materia');
  }

  editSubject(subject: any) {
    // Implementar lógica para editar materia
    console.log('Editar materia:', subject);
  }

  deleteSubject(subject: any) {
    // Implementar lógica para eliminar materia
    console.log('Eliminar materia:', subject);
  }
} 
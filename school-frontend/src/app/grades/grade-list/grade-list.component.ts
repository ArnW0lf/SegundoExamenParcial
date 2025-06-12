import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-grade-list',
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
        <mat-card-title>Gestión de Grados</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="grades">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let grade">{{grade.id}}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let grade">{{grade.name}}</td>
            </ng-container>

            <ng-container matColumnDef="level">
              <th mat-header-cell *matHeaderCellDef>Nivel</th>
              <td mat-cell *matCellDef="let grade">{{grade.level}}</td>
            </ng-container>

            <ng-container matColumnDef="students">
              <th mat-header-cell *matHeaderCellDef>Estudiantes</th>
              <td mat-cell *matCellDef="let grade">{{grade.students}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let grade">
                <button mat-icon-button color="primary" (click)="editGrade(grade)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteGrade(grade)">
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
        <button mat-raised-button color="primary" (click)="addGrade()">
          <mat-icon>add</mat-icon>
          Agregar Grado
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
export class GradeListComponent {
  grades = [
    { id: 1, name: '1° A', level: 'Primaria', students: 25 },
    { id: 2, name: '2° B', level: 'Primaria', students: 28 },
    { id: 3, name: '3° A', level: 'Primaria', students: 30 }
  ];

  displayedColumns = ['id', 'name', 'level', 'students', 'actions'];

  addGrade() {
    // Implementar lógica para agregar grado
    console.log('Agregar grado');
  }

  editGrade(grade: any) {
    // Implementar lógica para editar grado
    console.log('Editar grado:', grade);
  }

  deleteGrade(grade: any) {
    // Implementar lógica para eliminar grado
    console.log('Eliminar grado:', grade);
  }
} 
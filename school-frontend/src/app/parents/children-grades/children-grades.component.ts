import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-children-grades',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Calificaciones de mis Hijos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="select-container">
            <mat-form-field>
              <mat-label>Seleccionar Hijo</mat-label>
              <mat-select [(ngModel)]="selectedChild" (selectionChange)="onChildSelect()">
                <mat-option *ngFor="let child of children" [value]="child">
                  {{child.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <table *ngIf="selectedChild" mat-table [dataSource]="grades" class="mat-elevation-z8">
            <ng-container matColumnDef="subject">
              <th mat-header-cell *matHeaderCellDef>Materia</th>
              <td mat-cell *matCellDef="let grade">{{grade.subject}}</td>
            </ng-container>

            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef>Calificación</th>
              <td mat-cell *matCellDef="let grade">{{grade.grade}}</td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let grade">{{grade.date}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .select-container {
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
    mat-form-field {
      width: 100%;
      max-width: 300px;
    }
  `]
})
export class ChildrenGradesComponent implements OnInit {
  children: any[] = [];
  grades: any[] = [];
  selectedChild: any = null;
  displayedColumns: string[] = ['subject', 'grade', 'date'];

  constructor() {}

  ngOnInit(): void {
    // TODO: Cargar lista de hijos desde el servicio
    this.children = [
      { id: 1, name: 'Juan Pérez' },
      { id: 2, name: 'Ana Pérez' }
    ];
  }

  onChildSelect(): void {
    if (this.selectedChild) {
      // TODO: Cargar calificaciones del hijo seleccionado desde el servicio
      this.grades = [
        { subject: 'Matemáticas', grade: 85, date: '2024-03-15' },
        { subject: 'Literatura', grade: 90, date: '2024-03-14' },
        { subject: 'Historia', grade: 88, date: '2024-03-13' }
      ];
    }
  }
} 
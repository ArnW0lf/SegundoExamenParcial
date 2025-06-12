import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-my-children',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Mis Hijos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="children" class="mat-elevation-z8">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let child">{{child.id}}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let child">{{child.name}}</td>
            </ng-container>

            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef>Grado</th>
              <td mat-cell *matCellDef="let child">{{child.grade}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let child">
                <button mat-icon-button color="primary" (click)="viewGrades(child)">
                  <mat-icon>grade</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="viewAttendance(child)">
                  <mat-icon>event</mat-icon>
                </button>
              </td>
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
    table {
      width: 100%;
      margin-top: 20px;
    }
  `]
})
export class MyChildrenComponent implements OnInit {
  children: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'grade', 'actions'];

  constructor() {}

  ngOnInit(): void {
    // TODO: Cargar hijos desde el servicio
    this.children = [
      { id: 1, name: 'Juan Pérez', grade: '1° A' },
      { id: 2, name: 'Ana Pérez', grade: '3° B' }
    ];
  }

  viewGrades(child: any): void {
    console.log('Ver calificaciones de:', child);
  }

  viewAttendance(child: any): void {
    console.log('Ver asistencia de:', child);
  }
} 
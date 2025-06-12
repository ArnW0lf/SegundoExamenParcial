import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GradeService } from '../../services/grade.service';
import { Grade } from '../../models/grade.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-grade-list',
  templateUrl: './grade-list.html',
  styleUrls: ['./grade-list.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class GradeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'student_name', 'subject_name', 'grade_value', 'description', 'date_recorded', 'actions'];
  dataSource = new MatTableDataSource<Grade>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private gradeService: GradeService,
    private snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    console.log('Iniciando componente de lista de calificaciones');
    this.loadGrades();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadGrades(): void {
    console.log('Cargando calificaciones');
    this.isLoading = true;
    this.gradeService.getGradesByTeacher().subscribe({
      next: (grades) => {
        console.log('Calificaciones recibidas:', grades);
        this.dataSource.data = grades;
      },
      error: (error) => {
        console.error('Error al cargar calificaciones:', error);
        this.snackBar.open('Error al cargar las calificaciones. Por favor, intente de nuevo.', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteGrade(gradeId: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta calificación?')) {
      console.log(`Eliminando calificación ${gradeId}`);
      this.isLoading = true;
      // Implementar la eliminación cuando esté disponible en el backend
      this.snackBar.open('Función de eliminación aún no implementada', 'Cerrar', { duration: 3000 });
      this.isLoading = false;
    }
  }

  editGrade(gradeId: number): void {
    console.log(`Navegando a editar calificación ${gradeId}`);
    this.router.navigate(['/grades/edit', gradeId]);
  }

  navigateToCreate(): void {
    console.log('Navegando a crear nueva calificación');
    this.router.navigate(['/grades/new']);
  }
} 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GradeService } from '../../services/grade.service';
import { GradePayload } from '../../models/grade.model';
import { Subject } from '../../models/subject.model';
import { Student } from '../../models/student.model';
import { Observable, of } from 'rxjs';
import { startWith, switchMap, catchError, tap, finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-grade-form',
  templateUrl: './grade-form.html',
  styleUrls: ['./grade-form.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule
  ]
})
export class GradeFormComponent implements OnInit {
  gradeForm: FormGroup;
  isLoading = false;
  isStudentsLoading = false;

  subjects$: Observable<Subject[]> = of([]);
  students$: Observable<Student[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private gradeService: GradeService,
    private snackBar: MatSnackBar
  ) {
    this.gradeForm = this.fb.group({
      subject_id: [null, Validators.required],
      student_id: [{ value: null, disabled: true }, Validators.required],
      grade_value: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Iniciando componente de calificaciones');
    this.isLoading = true;
    this.subjects$ = this.gradeService.getSubjectsForTeacher().pipe(
      tap(subjects => {
        console.log('Materias cargadas:', subjects);
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Error al cargar materias:', err);
        this.snackBar.open('Error al cargar las materias. Por favor, intente de nuevo.', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    );

    this.gradeForm.get('subject_id')?.valueChanges.subscribe(subjectId => {
      console.log('Materia seleccionada:', subjectId);
      const studentControl = this.gradeForm.get('student_id');
      studentControl?.reset();
      if (subjectId) {
        this.isStudentsLoading = true;
        studentControl?.enable();
        this.students$ = this.gradeService.getStudentsForSubject(subjectId).pipe(
          tap(students => {
            console.log('Estudiantes cargados:', students);
            this.isStudentsLoading = false;
          }),
          catchError(err => {
            console.error('Error al cargar estudiantes:', err);
            this.snackBar.open('Error al cargar los estudiantes. Por favor, intente de nuevo.', 'Cerrar', { duration: 3000 });
            this.isStudentsLoading = false;
            studentControl?.disable();
            return of([]);
          }),
          finalize(() => this.isStudentsLoading = false)
        );
      } else {
        studentControl?.disable();
        this.students$ = of([]);
      }
    });
  }

  onSubmit(): void {
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      this.snackBar.open('Por favor, complete todos los campos requeridos correctamente.', 'Cerrar', { duration: 3000 });
      return;
    }

    console.log('Enviando calificación:', this.gradeForm.value);
    this.isLoading = true;
    const gradePayload: GradePayload = this.gradeForm.value;

    this.gradeService.recordGrade(gradePayload).subscribe({
      next: (recordedGrade) => {
        console.log('Calificación registrada:', recordedGrade);
        this.snackBar.open('Calificación registrada exitosamente!', 'Cerrar', { duration: 3000 });
        this.gradeForm.reset();
        this.gradeForm.get('subject_id')?.setValue(null);
        this.gradeForm.get('student_id')?.disable();
      },
      error: (err) => {
        console.error('Error al registrar calificación:', err);
        let errorMessage = 'Error al registrar la calificación.';
        if (err.error) {
          const errors = Object.entries(err.error)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join('; ');
          if (errors) errorMessage += ` Detalles: ${errors}`;
        }
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 7000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.gradeForm.reset();
    this.gradeForm.get('subject_id')?.setValue(null);
    this.gradeForm.get('student_id')?.disable();
    this.students$ = of([]);
  }
}

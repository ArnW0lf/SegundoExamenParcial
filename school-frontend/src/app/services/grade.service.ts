import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Grade, GradePayload } from '../models/grade.model';
import { Subject } from '../models/subject.model';
import { Student } from '../models/student.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = '/api/grades-records';
  private teacherApiUrl = '/api/teacher-subjects';
  private subjectsUrl = '/api/subjects';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get subjects for the currently logged-in teacher
  getSubjectsForTeacher(): Observable<Subject[]> {
    console.log('Solicitando materias del profesor');
    return this.http.get<Subject[]>(`${this.subjectsUrl}/`).pipe(
      tap(subjects => console.log('Materias recibidas:', subjects)),
      catchError(this.handleError)
    );
  }

  // Get students for a specific subject
  getStudentsForSubject(subjectId: number): Observable<Student[]> {
    console.log(`Solicitando estudiantes para la materia ${subjectId}`);
    return this.http.get<Student[]>(`${this.subjectsUrl}/${subjectId}/enrolled_students/`).pipe(
      tap(students => console.log('Estudiantes recibidos:', students)),
      catchError(this.handleError)
    );
  }

  // Record a new grade
  recordGrade(gradeData: GradePayload): Observable<Grade> {
    console.log('Enviando datos de calificación:', gradeData);
    return this.http.post<Grade>(this.apiUrl + '/', gradeData).pipe(
      tap(response => console.log('Respuesta del servidor:', response)),
      catchError(this.handleError)
    );
  }

  // Get grades for a specific student
  getGradesByStudent(studentId: number): Observable<Grade[]> {
    console.log(`Solicitando calificaciones del estudiante ${studentId}`);
    return this.http.get<Grade[]>(`${this.apiUrl}/?student_id=${studentId}`).pipe(
      tap(grades => console.log('Calificaciones recibidas:', grades)),
      catchError(this.handleError)
    );
  }

  // Get grades for a specific subject
  getGradesBySubject(subjectId: number): Observable<Grade[]> {
    console.log(`Solicitando calificaciones de la materia ${subjectId}`);
    return this.http.get<Grade[]>(`${this.apiUrl}/?subject_id=${subjectId}`).pipe(
      tap(grades => console.log('Calificaciones recibidas:', grades)),
      catchError(this.handleError)
    );
  }

  // Get grades recorded by the current teacher
  getGradesByTeacher(): Observable<Grade[]> {
    console.log('Solicitando calificaciones del profesor');
    return this.http.get<Grade[]>(`${this.apiUrl}/`).pipe(
      tap(grades => console.log('Calificaciones recibidas:', grades)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud HTTP:', error);
    let errorMessage = 'Ha ocurrido un error desconocido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        const errors = error.error;
        const messages = Object.keys(errors)
          .map(key => `${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`)
          .join('\n');
        if (messages) {
          errorMessage += `\nDetalles: ${messages}`;
        }
      } else if (typeof error.error === 'string') {
        errorMessage += `\nDetalles: ${error.error}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => error);
  }
}

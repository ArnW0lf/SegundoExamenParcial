import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Removed 'of' as it's not used here anymore
import { catchError } from 'rxjs/operators';
import { Teacher } from '../models/teacher.model';
import { Subject } from '../models/subject.model'; // Import full Subject model
import { SubjectService } from './subject.service'; // Import SubjectService
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/api/teachers`;

  constructor(
    private http: HttpClient,
    private subjectService: SubjectService // Inject SubjectService
  ) {}

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl + '/')
      .pipe(catchError(this.handleError));
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}/`)
      .pipe(catchError(this.handleError));
  }

  createTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl + '/', teacher)
      .pipe(catchError(this.handleError));
  }

  updateTeacher(id: number, teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}/`, teacher)
      .pipe(catchError(this.handleError));
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`)
      .pipe(catchError(this.handleError));
  }

  // Updated to use SubjectService
  getAvailableSubjects(): Observable<Subject[]> { // Return type is now Subject[]
    return this.subjectService.getSubjects() // Call the actual service
      .pipe(catchError(this.handleError)); // Optional: handle error specifically for subjects loading
  }

  getMySubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-subjects/`);
  }

  getMyStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-students/`);
  }

  getStudentsBySubject(subjectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subjects/${subjectId}/students/`);
  }

  getStudentGrades(studentId: number, subjectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students/${studentId}/subjects/${subjectId}/grades/`);
  }

  getStudentAttendance(studentId: number, subjectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students/${studentId}/subjects/${subjectId}/attendance/`);
  }

  saveGrade(studentId: number, subjectId: number, grade: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/students/${studentId}/subjects/${subjectId}/grades/`, grade);
  }

  saveAttendance(studentId: number, subjectId: number, attendance: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/students/${studentId}/subjects/${subjectId}/attendance/`, attendance);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        const errors = error.error;
        const messages = Object.keys(errors)
          .map(key => `${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`)
          .join('\n');
        if (messages) {
          errorMessage += `\nDetails: ${messages}`;
        }
      } else if (typeof error.error === 'string') {
        errorMessage += `\nDetails: ${error.error}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => error); // Propagate the original error
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from '../models/student.model'; // Adjust path if necessary

@Injectable({
  providedIn: 'root' // No change if it's already root
})
export class StudentService {
  private apiUrl = 'http://127.0.0.1:8000/api/students'; // URL directa al backend de Django

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl + '/').pipe(
      catchError(this.handleError)
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl + '/', student).pipe(
      catchError(this.handleError)
    );
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}/`, student).pipe(
      catchError(this.handleError)
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        // Try to get specific error messages from backend if available
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
    return throwError(() => error);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = `${environment.apiUrl}/api/predictions`;

  constructor(private http: HttpClient) {}

  getPrediction(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/${studentId}/`);
  }

  getStudentStats(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/${studentId}/stats/`);
  }

  getGeneralStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/`);
  }

  getPerformanceComparison(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/performance-comparison/`);
  }
} 
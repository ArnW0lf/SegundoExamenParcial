import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  getGeneralStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/`);
  }

  getStudentStats(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/student-dashboard/${studentId}/`);
  }

  getTeacherStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teachers/stats/`);
  }

  getPerformanceStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/predictions/performance-comparison/`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/crop';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getReports(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.createAuthHeaders() });
  }

  analyzeCrop(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/analyze`, formData, { headers: this.createAuthHeaders() });
  }
}
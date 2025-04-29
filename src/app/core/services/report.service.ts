// src/app/core/services/report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private baseUrl = `${environment.apiUrl}/reports/transactions`; // Ajusta si cambia

  constructor(private http: HttpClient) {}

  getReport(
    customerId: number,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  downloadPdf(
    customerId: number,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/pdf?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`,
      {
        responseType: 'blob', // para manejar binario PDF
      }
    );
  }
}

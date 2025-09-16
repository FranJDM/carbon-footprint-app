import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmissionRecord, EmissionRecordDetails } from '../models/emission.model';

@Injectable({
  providedIn: 'root'
})
export class EmissionService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

// emission.service.ts - modifica los métodos:

getEmissionsByCompany(companyId: number): Observable<EmissionRecordDetails[]> {
  console.log(`🌐 GET emisiones para empresa ID: ${companyId}`);
  const url = `${this.apiUrl}/emissions/company/${companyId}`;
  console.log('URL:', url);
  return this.http.get<EmissionRecordDetails[]>(url);
}

createEmission(emission: any): Observable<EmissionRecord> {
  console.log('🌐 POST nueva emisión:', emission);
  const url = `${this.apiUrl}/emissions`;
  console.log('URL:', url);
  return this.http.post<EmissionRecord>(url, emission);
}

deleteEmission(id: number): Observable<void> {
  console.log(`🌐 DELETE emisión ID: ${id}`);
  const url = `${this.apiUrl}/emissions/${id}`;
  console.log('URL:', url);
  return this.http.delete<void>(url);
}

   getAllEmissions(): Observable<EmissionRecordDetails[]> {
    return this.http.get<EmissionRecordDetails[]>(`${this.apiUrl}/emissions`);
  }

}
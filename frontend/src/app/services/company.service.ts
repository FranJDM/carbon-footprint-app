import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8080/api/companies';

  constructor(private http: HttpClient) { }

  // Obtener todas las empresas
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  // Crear una nueva empresa
  createCompany(company: { name: string; sector: string }): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/new-company`, company);
  }

  // ✅ Eliminar una empresa por ID
  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Actualizar una empresa existente
updateCompany(id: number, company: { name: string; sector: string }): Observable<Company> {
  return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
}

}

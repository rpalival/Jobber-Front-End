import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Companies } from '../../core/models/companies.model';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
    constructor(
        private http: HttpClient
    ) {}
    
    callGetCompanies(): Observable<Companies[]> {
        return this.http.get<Companies[]>('/api/companies/');
    }

    createCompany(applicationData: Companies): Observable<Companies> {
        return this.http.post<Companies>('/api/companies/', applicationData)
    }

    deleteCompany(id: number): Observable<void> {
        return this.http.delete<void>(`/api/companies/${id}`);
    }

    updateCompany(id: number, updateData: any): Observable<Companies> {
        return this.http.put<Companies>(`/api/companies/${id}/`, updateData);
    }
}

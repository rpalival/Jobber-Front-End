import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobApplication } from '../../core/models/job-application.model';
@Injectable({
    providedIn: 'root'
})
export class JobApplicationsService {

    constructor(
        private http: HttpClient
    ) {}

    callGetJobApplications(): Observable<JobApplication[]> {
        return this.http.get<JobApplication[]>('/api/applications/');
    }

    createJobApplication(applicationData: JobApplication): Observable<JobApplication> {
        return this.http.post<JobApplication>('/api/job-applications/', applicationData)
    }

    deleteJobApplication(id: number): Observable<void> {
        return this.http.delete<void>(`/api/applications/${id}`);
    }

    updateJobApplication(id: number, updateData: any): Observable<JobApplication> {
        return this.http.put<JobApplication>(`/api/applications/${id}/`, updateData);
    }
}

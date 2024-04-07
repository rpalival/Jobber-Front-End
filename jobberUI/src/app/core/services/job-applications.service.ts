import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobApplication } from '../../core/models/job-application.model';
@Injectable({
    providedIn: 'root'
})
export class JobApplicationsService {

    private baseUrl = 'http://localhost:3002';

    constructor(
        private http: HttpClient
    ) {}

    callGetJobApplications(): Observable<JobApplication[]> {
        return this.http.get<JobApplication[]>('api/jobApplications');
    }

    deleteJobApplication(id: number): Observable<void> {
        return this.http.delete<void>('/api/jobApplications/${id}');
    }
}

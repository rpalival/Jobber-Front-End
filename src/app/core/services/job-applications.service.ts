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
        return this.http.get<JobApplication[]>('/api/r_applications/');
    }

    deleteJobApplication(id: number): Observable<void> {
        return this.http.delete<void>('/api/jobApplications/${id}');
    }
}

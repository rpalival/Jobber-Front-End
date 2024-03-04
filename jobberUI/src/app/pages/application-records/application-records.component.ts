import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular'; // AG Grid component
import { ColDef, GridApi } from 'ag-grid-community'; // Column Definition Type Interface
import { Observable } from 'rxjs';
import { JobApplicationsService } from '../../core/services/job-applications.service';
import { JobApplication } from '../../core/models/job-application.model';

@Component({
    selector: 'jobber-application-records',
    standalone: true,
    imports: [AgGridModule, CommonModule],
    templateUrl: './application-records.component.html',
    styleUrl: './application-records.component.scss'
})
export class ApplicationRecordsComponent implements OnInit {
    gridApi: GridApi | undefined;
    rowData$: Observable<JobApplication[]> | undefined;
    colDefs: ColDef[] = [
        { field: 'jobTitle', headerName: 'Job Title' },
        { field: 'company', headerName: 'Company' },
        { field: 'status', headerName: 'Status' },
        { field: 'location', headerName: 'Location' },
        { field: 'datePosted', headerName: 'Date Posted' },
        { field: 'dateSaved', headerName: 'Date Saved' },
        { field: 'dateApplied', headerName: 'Date Applied' },
        { field: 'followUpDate', headerName: 'Follow-Up Date' },
        { field: 'resume', headerName: 'Resume' },
        { field: 'coverLetter', headerName: 'Cover Letter' },
        { field: 'minSalary', headerName: 'Min Salary' },
        { field: 'maxSalary', headerName: 'Max Salary' },
    ];
    defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        editable: true
    }
    constructor(private jobApplicationsService: JobApplicationsService) {}

    ngOnInit() {
        this.rowData$ = this.jobApplicationsService.callGetJobApplications();
    }
    onGrindReady(params: { api?: GridApi }) {
        this.gridApi = params?.api;
    }
}

import { Component, OnInit } from '@angular/core';
// import { AgGridModule } from 'ag-grid-angular'; // AG Grid component
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbHighlight, ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
    ColDef,
    DataTypeDefinition,
    ValueFormatterLiteParams,
    ValueParserLiteParams,
    GridApi,
    SizeColumnsToContentStrategy,
    SizeColumnsToFitGridStrategy,
    SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';
import { Observable } from 'rxjs';
import { JobApplicationsService } from '../../core/services/job-applications.service';
import { JobApplication } from '../../core/models/job-application.model';

@Component({
    selector: 'jobber-application-records',
    // imports: [AgGridModule, CommonModule, FormsModule, ReactiveFormsModule, NgbHighlight, NgbTypeaheadModule],
    templateUrl: './application-records.component.html',
    styleUrl: './application-records.component.scss'
})
export class ApplicationRecordsComponent implements OnInit {
    gridApi: GridApi | undefined;
    rowData$: Observable<JobApplication[]> | undefined;
    jobDetailsForm: FormGroup;
    colDefs: ColDef[] = [
        { field: 'jobTitle', headerName: 'Job Title', checkboxSelection: true },
        { field: 'company', headerName: 'Company' },
        { field: 'status', headerName: 'Status', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Applying', 'Applied', 'Interviewing', 'Negotiating', 'Accepted', 'Declined', 'Rejected', 'Archived'] } },
        { field: 'location', headerName: 'Location' },
        { field: 'dateApplied', headerName: 'Date Applied', cellDataType: 'dateString', cellEditor: 'agDateStringCellEditor' },
        { field: 'followUpDate', headerName: 'Follow-Up Date', cellDataType: 'dateString', cellEditor: 'agDateStringCellEditor' },
        { field: 'minSalary', headerName: 'Min Salary' },
        { field: 'maxSalary', headerName: 'Max Salary' },
    ];
    defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        editable: true
    }
    public autoSizeStrategy:
        | SizeColumnsToFitGridStrategy
        | SizeColumnsToFitProvidedWidthStrategy
        | SizeColumnsToContentStrategy = {
        type: 'fitCellContents',
    };
    public dataTypeDefinitions: {
        [cellDataType: string]: DataTypeDefinition;
    } = {
            dateString: {
                baseDataType: 'dateString',
                extendsDataType: 'dateString',
                valueParser: (params: ValueParserLiteParams<JobApplication, string>) =>
                    params.newValue != null && params.newValue.match('\\d{2}/\\d{2}/\\d{4}')
                    ? params.newValue
                    : null,
                valueFormatter: (
                    params: ValueFormatterLiteParams<JobApplication, string>
                ) => (params.value == null ? '' : params.value),
                dataTypeMatcher: (value: any) =>
                    typeof value === 'string' && !!value.match('\\d{2}/\\d{2}/\\d{4}'),
                dateParser: (value: string | undefined) => {
                    if (value == null || value === '') {
                    return undefined;
                    }
                    const dateParts = value.split('/');
                    return dateParts.length === 3
                    ? new Date(
                        parseInt(dateParts[2]),
                        parseInt(dateParts[1]) - 1,
                        parseInt(dateParts[0])
                        )
                    : undefined;
                },
                dateFormatter: (value: Date | undefined) => {
                    if (value == null) {
                    return undefined;
                    }
                    const date = String(value.getDate());
                    const month = String(value.getMonth() + 1);
                    return `${month.length === 1 ? '0' + month : month}/${
                        date.length === 1 ? '0' + date : date
                    }/${value.getFullYear()}`; // Adjust the order of month and date
                },
            },
        };
    
    get jobTitleControl(): FormControl {
        return this.jobDetailsForm.get("jobTitle") as FormControl;
    }
    get jobURLControl(): FormControl {
        return this.jobDetailsForm.get("jobURL") as FormControl;
    }
    get companyControl(): FormControl {
        return this.jobDetailsForm.get("company") as FormControl;
    }
    get locationControl(): FormControl {
        return this.jobDetailsForm.get("location") as FormControl;
    }
    get jobDescriptionControl(): FormControl {
        return this.jobDetailsForm.get("jobDescription") as FormControl;
    }

    constructor(
        private jobApplicationsService: JobApplicationsService,
        private fb: FormBuilder,
        private modalService: NgbModal
    ) {
        this.jobDetailsForm = this.fb.group({
            jobTitle: this.fb.control('', [ Validators.required ]),
            jobURL: this.fb.control('', [ Validators.required ]),
            company: this.fb.control('', [ Validators.required ]),
            location: this.fb.control(''),
            jobDescription: this.fb.control('', [ Validators.required ]),
        })
    }

    open(content: any){
        this.modalService.open(content).result.then(
            (result) => {
                //closing
            },
            (reason) => {
                // Dismiss
            }
        )
    }

    ngOnInit() {
        this.rowData$ = this.jobApplicationsService.callGetJobApplications();
    }
    onGrindReady(params: { api?: GridApi }) {
        this.gridApi = params?.api;
    }
}

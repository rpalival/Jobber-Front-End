import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColTypeDef, ColDef, ValueFormatterParams, ValueFormatterLiteParams, DataTypeDefinition, ValueParserLiteParams, GridApi, StatusPanelDef, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy, CellValueChangedEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { Observable } from 'rxjs';
import { JobApplicationsService } from '../../core/services/job-applications.service';
import { JobApplication } from '../../core/models/job-application.model';
import { LicenseManager } from  'ag-grid-enterprise'
import { of } from 'rxjs';

LicenseManager.setLicenseKey("[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-057528}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{14 May 2024}____[v3]_[0102]_MTcxNTY0MTIwMDAwMA==6ff4143f8d6a412a9d66750abe4d9ae3")

@Component({
    selector: 'jobber-application-records',
    templateUrl: './application-records.component.html',
    styleUrl: './application-records.component.scss'
})

export class ApplicationRecordsComponent implements OnInit {

    gridApi: GridApi | undefined;
    rowData$: Observable<JobApplication[]> | undefined;
    jobDetailsForm: FormGroup;
    selectedRowCount = 0;
    // @ts-ignore
    closeResult: any;
    // @ts-ignore
    selectedRecord: any;
    jobTitlesString: string = ''; // Declare jobTitlesString property

    constructor(
        private jobApplicationsService: JobApplicationsService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private config: NgbModalConfig,
        private cdRef: ChangeDetectorRef
    ) {
        this.jobDetailsForm = this.fb.group({
            job_title: this.fb.control('', [ Validators.required ]),
            job_URL: this.fb.control('', [ Validators.required ]),
            status: this.fb.control('', [ Validators.required ]),
            company: this.fb.control('', [ Validators.required ]),
            location: this.fb.control('', [ Validators.required ]),
            jobDescription: this.fb.control('', [ Validators.required ]),
            max_salary: this.fb.control(''),
            min_salary: this.fb.control(''),
            date_applied: this.fb.control('', [ Validators.required ]),
            follow_up_date: this.fb.control('')
        })
    }

    public columnTypes: {
        [key: string]: ColTypeDef;
    } = {
            currency: {
                valueFormatter: currencyFormatter,
            }
        };

    // AG Grid column definitions
    colDefs: ColDef[] = [
        { field: 'job_title', headerName: 'Job Title', checkboxSelection: true, rowDrag: true },
        { field: 'company', headerName: 'Company' },
        { field: 'status', headerName: 'Status',filter: "agSetColumnFilter", cellEditor: 'agRichSelectCellEditor', cellEditorParams: { values: ['Applying', 'Applied', 'Interviewing', 'Negotiating', 'Accepted', 'Declined', 'Rejected', 'Archived'] } },
        { field: 'location', headerName: 'Location' },
        { field: 'dateApplied', headerName: 'Date Applied', cellDataType: 'dateString', cellEditor: 'agDateStringCellEditor', filter: 'agDateColumnFilter' },
        { field: 'followUpDate', headerName: 'Follow-Up Date', cellDataType: 'dateString', cellEditor: 'agDateStringCellEditor', filter: 'agDateColumnFilter' },
        { field: 'min_salary', headerName: 'Min Salary', type: 'currency' },
        { field: 'max_salary', headerName: 'Max Salary', type: 'currency' },
    ];

    // AG Grid default options
    defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        editable: true,
        enableRowGroup: true
    }

    // AG Grid checkbox selection logic
    selectAll(event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            this.gridApi?.selectAll(); // Select all rows
        } else {
            this.gridApi?.deselectAll(); // Deselect all rows
        }
        this.updateSelectedCount();
    }
    
    onSelectionChanged(event: any) {
        this.updateSelectedCount();
    }

    updateSelectedCount() {
        this.selectedRowCount = this.gridApi?.getSelectedRows().length || 0;
    }

    // AG Grid Quick filter logic
    onFilterTextBoxChanged() {
        this.gridApi?.setGridOption(
            "quickFilterText",
            (document.getElementById("filter-text-box") as HTMLInputElement).value,
        );
    }

    // filter pipeline logic to track the active button state and filter accordingly
    selectedStatus: string = 'All Jobs';

    setJobFilter(filterValue: string) {
        this.selectedStatus = filterValue;
        this.gridApi?.setColumnFilterModel("status", filterValue === "All Jobs" ? null : {
            values: [filterValue],
        })
            .then(() => {
                this.gridApi?.onFilterChanged();
            });
    }

    // AG Grid status bar
    public statusBar: {
        statusPanels: StatusPanelDef[];
    } = {
            statusPanels: [
                { statusPanel: "agTotalAndFilteredRowCountComponent" },
                { statusPanel: "agTotalRowCountComponent" },
                { statusPanel: "agFilteredRowCountComponent" },
                { statusPanel: "agSelectedRowCountComponent" },
                { statusPanel: "agAggregationComponent" },
            ],
        };

    public autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
            type: 'fitCellContents',
        };

    // AG Grid data type definitions for date picker
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
                // @ts-ignore
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
        return this.jobDetailsForm.get("job_title") as FormControl;
    }
    get jobURLControl(): FormControl {
        return this.jobDetailsForm.get("job_URL") as FormControl;
    }
    get statusControl(): FormControl {
        return this.jobDetailsForm.get("status") as FormControl;
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
    get minSalaryControl(): FormControl {
        return this.jobDetailsForm.get("min_salary") as FormControl;
    }
    get maxSalaryControl(): FormControl {
        return this.jobDetailsForm.get("max_salary") as FormControl;
    }
    get dateAppliedControl(): FormControl {
        return this.jobDetailsForm.get("date_applied") as FormControl;
    }
    get followUpDateControl(): FormControl {
        return this.jobDetailsForm.get("follow_up_date") as FormControl;
    }

    // @ts-ignore
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
        this.updateSelectedCount();

        if (this.gridApi) { // Ensure Grid API is available
            this.gridApi.addEventListener('cellValueChanged', this.handleCellValueChanged.bind(this));
        }
    }

    handleCellValueChanged(event: CellValueChangedEvent): void {
        
        const changedRow = event.data; // Access the modified row
        const field = event.column.getColId(); // Get the field that changed
        const newValue = event.newValue; 

        // Prepare update data (you might adjust this based on your API)
        const updateData = {
            application_id: changedRow.application_id,
            [field]: newValue
        }; 

        // Call the PUT request
        this.jobApplicationsService.updateJobApplication(changedRow.application_id, updateData)
            .subscribe(
                (updatedApplication) => {
                    console.log('Application updated:', updatedApplication);
                },
                (error) => {
                    console.error('Error updating application:', error);
                    // Handle errors - display a message to the user, potentially revert the change in the grid
                }
            );
    }

    // @ts-ignore
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return "by pressing ESC";
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return "by clicking on a backdrop";
        } else {
            return `with: ${reason}`;
        }
    }


    onSubmit() {
        if (this.jobDetailsForm.invalid) return; // Check validity
        console.log('Form status:', this.jobDetailsForm.value);

    
        const applicationData = this.jobDetailsForm.value; 
        
        this.jobApplicationsService.createJobApplication(applicationData)
            .subscribe(
                (createdApplication) => {
                    console.log('Application created:', createdApplication);
                    // Handle successful submission (e.g., update UI)
                },
                (error) => {
                    console.error('Error creating application:', error);
                    // Handle errors 
                }
            );
    }


    // @ts-ignore
    onDeletedRecord(deleteTemplate: any) {
        const selectedRecord = this.gridApi?.getSelectedRows();
        console.log(`Selected records:`, selectedRecord);
        let newResponse: JobApplication[] = [];

        if (selectedRecord && selectedRecord.length > 0) {
            const selectedJobTitles = selectedRecord.map(record => record.job_title); // Extract jobTitles from selected rows
            this.jobTitlesString = selectedJobTitles.join(', '); // Convert array of jobTitles to comma-separated string

            this.modalService.open(deleteTemplate).result.then(
                (result) => {
                    this.closeResult = `Closed with: ${this.getDismissReason(result)}`;

                    // front-end logic for deleting
                    selectedRecord.forEach(record => {
                        console.log("Deleting job application with ID", record.application_id );

                        this.jobApplicationsService.deleteJobApplication(record.application_id).subscribe(
                            () => {
                                // Update frontend only if backend deletion succeeded
                                this.rowData$?.subscribe(response => {
                                    newResponse = response.filter((rec: JobApplication) => !selectedRecord?.some(selectedRecord => selectedRecord.jobTitle === rec.jobTitle));
                                    this.rowData$ = of(newResponse);
                                    this.cdRef.detectChanges();
                                }); 
                            },
                            (error) => {
                                console.error('Error deleting job application:', error);
                                // Handle error - you might display an alert to the user
                            }
                        );
                    });
                    
                },
                (reason) => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                }
            );
        }
        
        // const selectedRows = this.gridApi?.getSelectedRows();
        
        // if (selectedRows && selectedRows.length > 0) {
        //     // Logic to delete the selected application (or trigger DELETE request to the backend in the future)
        //     // For now, let's just log the selected rows for demonstration
        //     console.log("Selected Rows to Delete:", selectedRows);
        // }
    }

    checkIfSelected(): boolean {
        if (this.gridApi && this.gridApi.getSelectedRows) {
            const selectedRows = this.gridApi.getSelectedRows();
            return selectedRows ? selectedRows.length > 0 : false;
        }
        return false;
    }
}
function currencyFormatter(params: ValueFormatterParams) {
    const value = Math.floor(params.value);
    if (isNaN(value)) {
        return "";
    }
    return "$" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
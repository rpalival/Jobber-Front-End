import { ColDef, ValueFormatterLiteParams, DataTypeDefinition, ValueParserLiteParams, GridApi, StatusPanelDef, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy, CellValueChangedEvent } from 'ag-grid-community';
import { Observable, of } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { Contacts } from '../../core/models/contacts.model';
import { ContactsService } from '../../core/services/contacts.service';
@Component({
    selector: 'jobber-contacts',
    templateUrl: './contacts.component.html',
    styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit{

    gridApi: GridApi | undefined;
    rowData$: Observable<Contacts[]> | undefined;
    contactDetailsForm: FormGroup;
    selectedRowCount = 0;
    // @ts-ignore
    closeResult: any;
    // @ts-ignore
    selectedRecord: any;
    contactTitlesString: string = ''; // Declare jobTitlesString property

    constructor(
        private contactsService: ContactsService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private config: NgbModalConfig,
        private cdRef: ChangeDetectorRef
    ) {
        this.contactDetailsForm = this.fb.group({
            fullName: this.fb.control('', [ Validators.required ]),
            company: this.fb.control('', [ Validators.required ]),
            status: this.fb.control('', [ Validators.required ]),
            goal: this.fb.control('', [ Validators.required ]),
            location: this.fb.control('', [ Validators.required ]),
            relationship: this.fb.control('', [ Validators.required ]),
            followUpDate: this.fb.control(''),
            linkedin: this.fb.control(''),
            phone: this.fb.control(''),
            email: this.fb.control(''),

        })
    }
    colDefs: ColDef[] = [
        { field: 'fullName', headerName: 'Full Name', checkboxSelection: true, rowDrag: true },
        { field: 'company', headerName: 'Company' },
        { field: 'goal', headerName: 'Goal',filter: "agSetColumnFilter", cellEditor: 'agRichSelectCellEditor', cellEditorParams: { values: ['Informational Interview', 'Networking', 'Technical Interview', 'Job Interview', 'Onboarding', 'Request Referral', 'Research Interviewer', 'Research Career'] } },
        { field: 'status', headerName: 'Status',filter: "agSetColumnFilter", cellEditor: 'agRichSelectCellEditor', cellEditorParams: { values: ['Thank You Sent', 'To be Contacted', 'No Response', 'Follow-Up Required', 'Meeting Scheduled'] } },
        { field: 'location', headerName: 'Location' },
        { field: 'relationship', headerName: 'Relationship',filter: "agSetColumnFilter", cellEditor: 'agRichSelectCellEditor', cellEditorParams: { values: ['Acquaintance', 'Co-Worker', 'Friend', 'Family', 'Other', 'Recruiter', 'Mentor', 'Hiring Manager', 'Alumni', 'Ex-Employee'] } },
        { field: 'followUpDate', headerName: 'Follow-Up Date', cellDataType: 'dateString', cellEditor: 'agDateStringCellEditor', filter: 'agDateColumnFilter' },
        { field: 'phone', headerName: 'Phone' },
        { field: 'email', headerName: 'Email' },
        { field: 'linkedin', headerName: 'LinkedIn' }
    ];
    defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        editable: true,
        enableRowGroup: true
    }
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
    public dataTypeDefinitions: {
        [cellDataType: string]: DataTypeDefinition;
    } = {
            dateString: {
                baseDataType: 'dateString',
                extendsDataType: 'dateString',
                valueParser: (params: ValueParserLiteParams<Contacts, string>) =>
                    params.newValue != null && params.newValue.match('\\d{2}/\\d{2}/\\d{4}')
                        ? params.newValue
                        : null,
                valueFormatter: (
                    params: ValueFormatterLiteParams<Contacts, string>
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
    selectAll(event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            this.gridApi?.selectAll(); // Select all rows
        } else {
            this.gridApi?.deselectAll(); // Deselect all rows
        }
        this.updateSelectedCount();
    }
    // @ts-ignore
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

    ngOnInit() {
        this.rowData$ = this.contactsService.callGetContacts();
    }

    get fullNameControl(): FormControl {
        return this.contactDetailsForm.get("fullName") as FormControl;
    }
    get companyControl(): FormControl {
        return this.contactDetailsForm.get("company") as FormControl;
    }
    get locationControl(): FormControl {
        return this.contactDetailsForm.get("location") as FormControl;
    }
    get goalControl(): FormControl {
        return this.contactDetailsForm.get("goal") as FormControl;
    }
    get statusControl(): FormControl {
        return this.contactDetailsForm.get("status") as FormControl;
    }
    get relationshipControl(): FormControl {
        return this.contactDetailsForm.get("relationship") as FormControl;
    }
    get followUpDateControl(): FormControl {
        return this.contactDetailsForm.get("followUpDate") as FormControl;
    }
    get linkedinControl(): FormControl {
        return this.contactDetailsForm.get("linkedin") as FormControl;
    }
    get phoneControl(): FormControl {
        return this.contactDetailsForm.get("phone") as FormControl;
    }
    get emailControl(): FormControl {
        return this.contactDetailsForm.get("email") as FormControl;
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
            contact_id: changedRow.contact_id,
            [field]: newValue
        }; 

        // Call the PUT request
        this.contactsService.updateContact(changedRow.contact_id, updateData)
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
        if (this.contactDetailsForm.invalid) return; // Check validity
        console.log('Form status:', this.contactDetailsForm.value);

    
        const applicationData = this.contactDetailsForm.value; 
        
        this.contactsService.createContact(applicationData)
            .subscribe(
                (createdApplication) => {
                    console.log('Company created:', createdApplication);
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
        let newResponse: Contacts[] = [];

        if (selectedRecord && selectedRecord.length > 0) {
            const selectedContactTitles = selectedRecord.map(record => record.fullName); // Extract jobTitles from selected rows
            this.contactTitlesString = selectedContactTitles.join(', '); // Convert array of jobTitles to comma-separated string


            this.modalService.open(deleteTemplate).result.then(
                (result) => {
                    this.closeResult = `Closed with: ${this.getDismissReason(result)}`;

                    // front-end logic for deleting
                    selectedRecord.forEach(record => {
                        console.log("Deleting contact with ID", record.contact_id );

                        this.contactsService.deleteContact(record.contact_id).subscribe(
                            () => {
                                // Update frontend only if backend deletion succeeded
                                this.rowData$?.subscribe(response => {
                                    newResponse = response.filter((rec: Contacts) => !selectedRecord?.some(selectedRecord => selectedRecord.fullName === rec.fullName));
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

import { ColTypeDef, ColDef, GridApi, StatusPanelDef, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy, CellValueChangedEvent } from 'ag-grid-community';
import { Observable, of } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbHighlight, ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Companies } from '../../core/models/companies.model';
import { CompaniesService } from '../../core/services/companies.service';



@Component({
  selector: 'jobber-companies',
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit{

    gridApi: GridApi | undefined;
    rowData$: Observable<Companies[]> | undefined;
    companyDetailsForm: FormGroup;
    selectedRowCount = 0;
    closeResult: any;
    selectedRecord: any;
    companyTitlesString: string = ''; // Declare jobTitlesString property



    constructor(
        private companiesService: CompaniesService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private config: NgbModalConfig,
        private cdRef: ChangeDetectorRef
    ) {
        this.companyDetailsForm = this.fb.group({
            name: this.fb.control('', [ Validators.required ]),
            industry: this.fb.control(''),
            location: this.fb.control('', [ Validators.required ]),
            website: this.fb.control('', [ Validators.required ]),
            linkedin: this.fb.control('', [ Validators.required ])
        })
    }
    colDefs: ColDef[] = [
        { field: 'name', headerName: 'Name', checkboxSelection: true, rowDrag: true },
        { field: 'industry', headerName: 'Industry' },
        { field: 'location', headerName: 'Location' },
        { field: 'website', headerName: 'Website' },
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

    ngOnInit() {
        this.rowData$ = this.companiesService.callGetCompanies();
    }

    get nameControl(): FormControl {
        return this.companyDetailsForm.get("name") as FormControl;
    }
    get industryControl(): FormControl {
        return this.companyDetailsForm.get("industry") as FormControl;
    }
    get locationControl(): FormControl {
        return this.companyDetailsForm.get("location") as FormControl;
    }
    get websiteControl(): FormControl {
        return this.companyDetailsForm.get("website") as FormControl;
    }
    get linkedinControl(): FormControl {
        return this.companyDetailsForm.get("linkedin") as FormControl;
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
            company_id: changedRow.company_id,
            [field]: newValue
        }; 

        // Call the PUT request
        this.companiesService.updateCompany(changedRow.company_id, updateData)
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
        if (this.companyDetailsForm.invalid) return; // Check validity
        console.log('Form status:', this.companyDetailsForm.value);

    
        const applicationData = this.companyDetailsForm.value; 
        
        this.companiesService.createCompany(applicationData)
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

    onDeletedRecord(deleteTemplate: any) {
        const selectedRecord = this.gridApi?.getSelectedRows();
        console.log(`Selected records:`, selectedRecord);
        let newResponse: Companies[] = [];

        if (selectedRecord && selectedRecord.length > 0) {
            const selectedCompanyTitles = selectedRecord.map(record => record.name); // Extract jobTitles from selected rows
            this.companyTitlesString = selectedCompanyTitles.join(', '); // Convert array of jobTitles to comma-separated string


            this.modalService.open(deleteTemplate).result.then(
                (result) => {
                    this.closeResult = `Closed with: ${this.getDismissReason(result)}`;

                    // front-end logic for deleting
                    selectedRecord.forEach(record => {
                        console.log("Deleting company with ID", record.company_id );

                        this.companiesService.deleteCompany(record.company_id).subscribe(
                            () => {
                                // Update frontend only if backend deletion succeeded
                                this.rowData$?.subscribe(response => {
                                    newResponse = response.filter((rec: Companies) => !selectedRecord?.some(selectedRecord => selectedRecord.name === rec.name));
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
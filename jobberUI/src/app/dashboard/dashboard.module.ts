import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbHighlight, NgbTypeaheadModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import 'ag-grid-enterprise';
import { HomepageComponent } from './homepage/homepage.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompaniesComponent } from './companies/companies.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ApplicationRecordsComponent } from './application-records/application-records.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgChartsAngularModule } from 'ag-charts-angular';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: '',
                redirectTo: '/dashboard/homepage',
                pathMatch: 'full'
            },
            {
                path: 'homepage',
                component: HomepageComponent
            },
            {
                path: 'job-tracker',
                component: ApplicationRecordsComponent
            },
            {
                path: 'companies',
                component: CompaniesComponent
            },
            {
                path: 'contacts',
                component: ContactsComponent
            }
        ]
    },

]

@NgModule({
    declarations: [DashboardComponent, HomepageComponent, SideNavbarComponent, ApplicationRecordsComponent, CompaniesComponent, ContactsComponent],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        NgbHighlight,
        NgbTypeaheadModule,
        AgGridModule,
        AgChartsAngularModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class DashboardModule {
    sidebarExpanded: boolean = true;
    constructor() {}
    
}

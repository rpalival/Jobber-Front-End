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
import { ApplicationRecordsComponent } from './application-records/application-records.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
            }
        ]
    },

]

@NgModule({
  declarations: [DashboardComponent, HomepageComponent, SideNavbarComponent, ApplicationRecordsComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    NgbHighlight,
    NgbTypeaheadModule,
    AgGridModule,
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

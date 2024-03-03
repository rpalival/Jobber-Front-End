import { Routes } from '@angular/router';
import { ApplicationRecordsComponent } from './application-records/application-records.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
    {
        path: 'homepage',
        component: HomepageComponent
    },
    {
        path: 'job-tracker',
        component: ApplicationRecordsComponent
    }
];

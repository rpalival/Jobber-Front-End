import { Routes } from '@angular/router';
import { ApplicationRecordsComponent } from './pages/application-records/application-records.component';
import { HomepageComponent } from './pages/homepage/homepage.component';

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

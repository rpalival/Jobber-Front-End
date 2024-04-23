import { Routes } from '@angular/router';

import { LoginComponent } from './core/auth/login/login.component';
import { authGuardGuard } from './core/auth/auth-guard.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canMatch: [authGuardGuard]
    }
    // {
    //     path: 'homepage',
    //     component: HomepageComponent,
    //     canMatch: [authGuardGuard]
    // },
    // {
    //     path: 'job-tracker',
    //     component: ApplicationRecordsComponent,
    //     canMatch: [authGuardGuard]
    // }
];

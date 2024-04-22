import { Component } from '@angular/core';

@Component({
  selector: 'jobber-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    sidebarExpanded: boolean = true;
    constructor() {}
}

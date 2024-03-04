import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideNavbarComponent } from './pages/side-navbar/side-navbar.component';

@Component({
    selector: 'jobber-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, SideNavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'jobberUI';

    sidebarExpanded: boolean = true;
}
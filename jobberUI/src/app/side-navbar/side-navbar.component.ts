import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'jobber-side-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './side-navbar.component.html',
    styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {

    @Input() isExpanded: boolean = false;

    @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

    handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

    username = 'Raj Palival';

}

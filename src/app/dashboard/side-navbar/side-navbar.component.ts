import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'jobber-side-navbar',
    templateUrl: './side-navbar.component.html',

    styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {

    @Input() isExpanded: boolean = false;

    @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

    handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

    auth = inject(AuthService);
    username = JSON.parse(sessionStorage.getItem('loggedInUser')!).name;

    signOut() {
        sessionStorage.removeItem('loggedInUser');
        this.auth.signOut();
    }
}

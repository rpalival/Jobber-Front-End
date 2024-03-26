import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'jobber-homepage',
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
    auth = inject(AuthService);

    signOut() {
        sessionStorage.removeItem('loggedInUser');
        this.auth.signOut();
    }

}

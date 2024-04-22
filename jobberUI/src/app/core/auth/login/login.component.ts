declare var google: any;

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
	selector: 'student-details-login',
	standalone: true,
	imports: [CommonModule, FormsModule, GoogleSigninButtonModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent {
    // socialAuthService = inject(SocialAuthService);
    // router = inject(Router);
    // ngOnInit(): void {
    //     this.socialAuthService.authState.subscribe({    
    //         next: (result) => {
    //             console.log(result);
    //             localStorage.setItem('token', result.idToken);
    //             this.router.navigate(['dashboard']);
    //     },
    //         error: (error) => {
    //             console.log(error);
    //         }
    //     });
    // }
    ngOnInit(): void {
        google.accounts.id.initialize({
            client_id: '45559034011-ecc5m4ure945sktlud7ph5giv7r6fkm1.apps.googleusercontent.com',
            callback: (resp: any)=> this.handleLogin(resp),
        });
        google.accounts.id.renderButton(document.getElementById("google-btn"),{

            size: 'large',
            shape: 'rectangle',
            width: 250
        })
    }

    private decodeToken(token: string){
        return JSON.parse(atob(token.split('.')[1]));
    }
    handleLogin(response: any){
        if(response){
            //decode the token
            const payLoad = this.decodeToken(response.credential);
            //store it in session
            sessionStorage.setItem('loggedInUser', JSON.stringify(payLoad));
            //navigate to homepage or browse page
            this.router.navigate(['dashboard']);
        }
    }

	constructor(
		public authService: AuthService,
		private router: Router
	) {}
}

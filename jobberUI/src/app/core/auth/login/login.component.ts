declare var google: any;

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'student-details-login',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {


    ngOnInit(): void {
        google.accounts.id.initialize({
            client_id: '45559034011-ecc5m4ure945sktlud7ph5giv7r6fkm1.apps.googleusercontent.com',
            callback: (resp: any)=> this.handleLogin(resp)
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

	loginFormModel: any = {
		username: "",
		password: ""
	}
	constructor(
		public authService: AuthService,
		private router: Router
	) {}

	login(form: any) {
		console.log(form);
		this.authService.login().subscribe(
			() => {
				if (this.authService.isLoggedIn){
					
					const redirectUrl = '/dashboard';
					
					const navigationExtras: NavigationExtras = {
						queryParamsHandling: 'preserve',
						preserveFragment: true
					};

					this.router.navigate([redirectUrl], navigationExtras);
				}
			}
		)
	}

	logout() {
		this.authService.logOut();
	}
}

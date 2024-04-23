// @ts-ignore
declare let google: any;
import { Injectable, inject } from "@angular/core";

import { Observable, of } from "rxjs";
import { tap, delay } from "rxjs/operators";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    apiUrl!: string;

    constructor(
        private http: HttpClient
    ) {}
    
    router = inject(Router);
    // googlelogin(idToken: string) {
    //     return this.http.post<{ token : string }>(this.apiUrl + '/api/Auth/login', {
    //         idToken: idToken
    //     });
    // }
    isLoggedIn: boolean = true;
    redirectUrl: string|null = null;

    login(): Observable<boolean> {
        return of(true).pipe(
            delay(1000),
            tap(() => this.isLoggedIn = true)
        );
    }

    logOut(): void {
        this.isLoggedIn = false;
    }

    signOut() {
        google.accounts.id.disableAutoSelect();
        this.router.navigate(['login']);
    }
}
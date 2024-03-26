declare var google: any;
import { Injectable, inject } from "@angular/core";

import { Observable, of } from "rxjs";
import { tap, delay } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    router = inject(Router);
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

    constructor() {}
    signOut() {
        google.accounts.id.disableAutoSelect();
        this.router.navigate(['login']);
    }
}
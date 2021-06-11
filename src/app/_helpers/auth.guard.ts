import { Injectable } from '@angular/core';
import { Router,  ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { UserService } from '@app/services/user.service';

//class to implement Authentication to deny access to homepage if the user is not logged in
@Injectable({
    providedIn: 'root' 
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router, private userService: UserService) {}

    //method from the inherited CanActivate class
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const user = this.userService.userValue;
        //checks if the user data is present or not, basically checking if they are logged in
        if (user) {
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}

//class to implement Authentication to deny access to admin pages for other users than admin
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router, private userService: UserService) {}
    
    //method from the inherited CanActivate class    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.userService.userValue.username;

        //checks if the user is admin or not
        if (user == "admin") {
            // authorised so return true and give access to admin pages
            return true;
        }

        // redirect to the login page if user tries to access the admin urls
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
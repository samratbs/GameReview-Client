import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserService } from '@app/services/user.service';

//class that intercepts http responses from the api to check if there were any errors.
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) {}

    //intercept method from the inherited HttpInterceptor class
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.userService.logout();
            }
            
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}
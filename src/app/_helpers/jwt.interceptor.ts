import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { UserService } from '@app/services/user.service';


//Class that intercepts http requests from the application and adds a JWT auth token to the Authorization header
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private userService: UserService) { }

    //intercept method from the inherited HttpInterceptor class
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const user = this.userService.userValue;
        const isLoggedIn = user && user.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        // add auth header with jwt if user is logged in and request is to the backend api
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        }

        return next.handle(request);
    }
}
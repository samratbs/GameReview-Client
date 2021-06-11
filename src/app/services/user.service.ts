import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { User, Demographic, Platform } from '@app/models';

// Handles communication between the Angular app and the backend api for everything related to users
@Injectable({ 
    providedIn: 'root' 
})
export class UserService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router, private http: HttpClient) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    //Allows other components to access the user value of the currently logged in user without subscribing
    public get userValue(): User {
        return this.userSubject.value;
    }

    //sends a http request to the backend to login and maintains virtual identity
    login(username, password){
        return this.http.post<User>(`${environment.apiUrl}/users/login`, { username, password })
            .pipe(map(user => {
                // stores user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }
    //removes the user from the local storage so they can log out
    logout(){
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    //sends a http request to the backend to register
    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    //sends a http request to the backend to retreive the analyzed demographic results
    getdemographic(){
        return this.http.get<Demographic>(`${environment.apiUrl}/users/ratio`);
    }

    //sends a http request to the backend to retreive the analyzed platform results
    getplatform(){
        return this.http.get<Platform>(`${environment.apiUrl}/users/platform`);
    }

    //sends a http request to the backend to retreive all the user details
    getAll(){
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    //sends a http request to the backend to retreive a specific user using id  
    getById(id: string){
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }
    //sends a http request to the backend to update a specific user's details using id  
    update(id, params){
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // only update the stored user if the logged in user updates their own record
                if (id == this.userValue.id) {
                    // update the local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    //sends a http request to the backend to delete a specific user using userid  
    delete(id: string){
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deletes their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
}
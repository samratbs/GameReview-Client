import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Feedback, Ratings } from '@app/models/';


// Handles communication between the Angular app and the backend api for everything related to feedbacks
@Injectable({ providedIn: 'root' })
export class FeedbackService {

    constructor(private http: HttpClient) {}

    //sends a http request to the backend to add a user feedback to the database
    add(comment, type, ratings, userRef) {
        ratings = parseInt(ratings);
        return this.http.post<Feedback>(`${environment.apiUrl}/feedbacks/create`, { comment, type, ratings, userRef})
            .pipe(catchError(e => throwError(this.errorHandler(e))
            ));
    }
    errorHandler(error){
        console.log(error);
    }

    //sends a http request to the backend to retreive the analyzed Rating results    
    getRatings(){
        return this.http.get<Ratings>(`${environment.apiUrl}/feedbacks/avg`);
    }

    //sends a http request to the backend to retreive all the user feedbacks
    getAllFeedbacks() {
        return this.http.get<Feedback[]>(`${environment.apiUrl}/feedbacks`);
    }

    //sends a http request to the backend to retreive a specific user feedback using the user's id
    getFeebackById(id: string) {
        return this.http.get<Feedback>(`${environment.apiUrl}/feedbacks/${id}`);
    }

                
}
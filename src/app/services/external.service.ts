import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Handles communication between the Angular app and the external Web API
@Injectable({
    providedIn: 'root' 
})
export class ExternalService {

    constructor(private http: HttpClient){}

    //Retreives gamedata for the top 10 games of 2019-20 using the given external API endpoint
    getGames(){
        return this.http.get<External>(`https://api.rawg.io/api/games?key=3175fbf4e77c406da00c6b12cce1701b&dates=2019-01-01,2020-10-30&ordering=-added`);
    }

                
}
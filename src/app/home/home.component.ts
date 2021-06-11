import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '@app/services';
import { UserService } from '@app/services/user.service';
import {FeedbackService, ExternalService} from '@app/services/';
import { first } from 'rxjs/operators';


//component that handles the homepage
@Component({
    templateUrl: 'home.component.html' 
})
export class HomeComponent implements OnInit {
    user: User;
    form: FormGroup;
    submitted = false;
    ratings = [1,2,3,4,5,6,7,8,9,10];
    isFeedback: boolean;
    feedbacks = null;
    rate: string;
    games = null;
    gameresult: [];

    constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router,
        private feedbackService: FeedbackService, private alertService: AlertService, private route: ActivatedRoute,
        private externalService: ExternalService) {
        this.user = this.userService.userValue;
    }
    
    //called on page load
    ngOnInit(){

        this.isFeedback = false;

        //sets up and insures validation check on the registration form
        this.form = this.formBuilder.group({
            feedback: ['', Validators.required],
            comment: ['', Validators.required],
            rate: ['', Validators.required]
        });
        
        //calls the feedbackService service file to send backend requests for retreiving a specific user feedback
        this.feedbackService.getFeebackById(this.user.id)
            .pipe(first())
            .subscribe(feedbacks => {this.feedbacks = feedbacks},
                error => {
                    this.isFeedback = true;
                }
                );
        //calls the feedbackService service file to send backend requests for retreiving the analyzed ratings data
        this.feedbackService.getRatings()
                .pipe(first())
                .subscribe(ratings => this.rate = Number(ratings.rate).toFixed(1));
        
        //calls the externalService service file which helps to retrieve related game data from a external web API endpoint
        this.externalService.getGames()
            .pipe(first())
            .subscribe(games=>{this.games = games;
            console.log(games);
            });
    }
    
    // quick and easy access of the form fields
    get f() { return this.form.controls; }

    //method called to handle the click button event for sending feedback form    
    onSubmit(){

        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            console.log("invalid");
            return;
        }
         //calls the feedbackService service file to send backend requests for adding a feedback
        this.feedbackService.add(this.f.comment.value, this.f.feedback.value, this.f.rate.value, this.user.id)
            .pipe(first())
            .subscribe(data => {
                this.alertService.success('Feedback added successfully', { keepAfterRouteChange: true });
                this.isFeedback = true;
            },
            error => {
                    this.alertService.error(error);
                }
                );
        
    }
}
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from '@app/services/user.service';
import { FeedbackService } from '@app/services/feedback.service';


//component that handles the admin pages
@Component({
    templateUrl: 'admin.component.html' 
})
export class AdminComponent implements OnInit {

    users = null;
    feedbacks = null;
    demographic = null;
    platform = null;
    ratings = null;

    constructor(private userService: UserService, private feedbackService: FeedbackService) {}

    //called on page load
    ngOnInit() {

        //calls the userService service file to send backend requests for retreiving all users to display
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);

        //calls the feedbackService service file to send backend requests for retreiving all the feedbacks to display 
        this.feedbackService.getAllFeedbacks()
            .pipe(first())
            .subscribe(feedbacks => this.feedbacks = feedbacks);
        
        //calls the feedbackService service file to send backend requests for retreiving the analyzed rating data     
        this.feedbackService.getRatings()
            .pipe(first())
            .subscribe(ratings =>this.ratings = ratings);
        
        //calls the feedbackService service file to send backend requests for retreiving the analyzed demographic data    
        this.userService.getdemographic()
            .pipe(first())
            .subscribe(demographic => this.demographic = demographic);

        //calls the feedbackService service file to send backend requests for retreiving the analyzed player platform data     
        this.userService.getplatform()
            .pipe(first())
            .subscribe(platform => this.platform = platform);
    }
        


}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '@app/services';
import { UserService } from '@app/services/user.service';


//component that handles the login portion of the webpage
@Component({
    templateUrl: 'login.component.html' 
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    formIssubmitted = false;
    returnUrl: string;
    loading = false;

    constructor( private formBuilder: FormBuilder, private userService: UserService,
        private route: ActivatedRoute, private router: Router, private alertService: AlertService
    ) { }

    ngOnInit() {

        //sets up and insures validation check on the login form
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // quick and easy access of the form fields
    get f() { 
        return this.form.controls;
    }

    //method called to handle the click button event for login form
    onSubmit() {

        this.formIssubmitted = true;

        // clears all the alerts that was made on submit
        this.alertService.clear();

        // return the error message if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;

        //calls the userService service file to send backend requests for logging in
        this.userService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    //redirects to the homepage after a successful login
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    //shows error if login fails
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
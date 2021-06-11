import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '@app/services';
import { UserService } from '@app/services/user.service';


//component that handles the registration portion of the webpage
@Component({ 
    templateUrl: 'register.component.html' 
})
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor( private formBuilder: FormBuilder, private alertService: AlertService, private route: ActivatedRoute,
        private userService: UserService,  private router: Router,
    ) { }

    //called on page load
    ngOnInit() {

        //sets up and insures validation check on the registration form
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            gender: ['', Validators.required],
            preferredPlatform: ['', Validators.required],
        });
    }

    // quick and easy access of the form fields
    get f() { return this.form.controls; }

    //method called to handle the click button event for registration form
    onSubmit() {
        this.submitted = true;

        // clears all the alerts that was made on submit
        this.alertService.clear();

        // return the error message if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;

        //calls the userService service file to send backend requests for registering a user
        this.userService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Successfully registered', { keepAfterRouteChange: true });
                    //redirects to login page after a successful register
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error => {
                    //shows error if registration fails
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
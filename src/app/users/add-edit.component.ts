import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '@app/services';
import { UserService } from '@app/services/user.service';


//component that handles the user CRUD operation page handled by admins
@Component({ 
    templateUrl: 'add-edit.component.html'
})
export class AddEditComponent implements OnInit {

    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
        private userService: UserService, private alertService: AlertService) { }

    //called on page load
    ngOnInit() {
        //grabs the id of the user to be edited from the url
        this.id = this.route.snapshot.params['id'];

        //if there is no id in the url it calls the page in add mode for adding new users else in edit mode to edit an existing one
        this.isAddMode = !this.id;
        
        // password validator for minlength
        const passwordValidators = [Validators.minLength(6)];
        
        //adds validation if this is addmode
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }
        //sets up and insures validation check on the edit page
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            gender: ['', Validators.required],
            preferredPlatform: ['', Validators.required],
            
        });
        

        if (!this.isAddMode) {
            //sets up and insures validation check for the edit page
            this.form = this.formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                username: ['', Validators.required],
                password: ['', passwordValidators],
            });
            //calls the userService service file to send backend requests for retreiving infromation for a single user to edit.
            this.userService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.firstName.setValue(x.firstName);
                    this.f.lastName.setValue(x.lastName);
                    this.f.username.setValue(x.username);
                });
        }
    }

    // quick and easy access of the form fields
    get f() { return this.form.controls; }

    //method called to handle the click button event for registration form
    onSubmit() {

        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        
        //calls the createUser method if it is adding a new user else calls the updateUser method for edit
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    //calls the userService service file to send backend requests to register a new user
    private createUser() {

        this.userService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    //calls the userService service file to send backend requests to update the details of an existing user
    private updateUser() {

        this.userService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

}
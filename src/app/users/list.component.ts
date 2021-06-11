import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from '@app/services/user.service';


//component that handles the users page used by the admin
@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = null;

    constructor(private userService: UserService) {}

    //called on page load
    ngOnInit() {

        //calls the userService service file to send backend requests for retreiving all users to display
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    //method called to handle the click button event for deleting the user
    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;

        //calls the userService service file to send backend requests for deleting a specific user
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id) 
            });
    }
}
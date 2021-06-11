import { Component } from '@angular/core';

import { UserService } from './services/user.service';
import { User } from './models';


@Component({ 
    selector: 'app',
    templateUrl: 'app.component.html' 
})
export class AppComponent {
    
    user: User;

    constructor(private userService: UserService) {
        this.userService.user.subscribe(u => this.user = u);
    }

    logout() {
        this.userService.logout();
    }
}
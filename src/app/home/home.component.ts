import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

import { RegistrationDataService } from '../services/registration.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  _isDesktop: boolean = false;
  protected _userType: string = 'none';

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _regService: RegistrationDataService
  ) {
    this._breakpointObserver.observe([Breakpoints.Web]).subscribe((result) => {
      this._isDesktop = result.matches;
    });
  }

  ngOnInit() {
    this._regService
      .getRegisteredUserSubject()
      .pipe(take(1))
      .subscribe((registeredUser) => {
        console.log('calling the registered user subject');
        console.log(registeredUser);
        if (registeredUser) {
          console.log(registeredUser);
          this._userType = registeredUser?.role;
        } else {
          this._userType = '';
        }
      });
  }
}

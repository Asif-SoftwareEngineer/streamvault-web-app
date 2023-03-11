import * as PiModel from './models/pi-model';

import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable, filter, map } from 'rxjs';

import { AuthDataService } from 'src/app/services/auth-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IDialogAuthData } from './login/auth-modal-dialog/IDialogAuthData';
import { IUser } from './models/user';
import { MatIconRegistry } from '@angular/material/icon';
import { NotificationService } from './services/notification.service';
import { NotificationType } from './shared/enums';
import { PiNetworkService } from './services/PiNetwork.service';
import { Pi_Authentication } from './shared/pi-auth-payments';
import { RegistrationDataService } from './services/registration.service';
import { Role } from './models/enums';
import { Router } from '@angular/router';
import { TokenStorageService } from './services/token-storage.service';

interface CustomWindow extends Window {
  Pi: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  _title: string = 'streamweb3';
  _existingAppMode: string = '';
  _isHomeRoute: boolean = false;
  _isAuthenticated: boolean = false;
  _accessToken: string = '';
  _regUserData$!: Observable<{ user: IUser; userType: string }>;
  _isLoggedIn: boolean = false;
  isBusy = false;

  _windowRef = window as unknown as CustomWindow;

  $appModeArr: string[] = ['Stream', 'Studio'];

  constructor(
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _dialog: MatDialog,
    private _authService: AuthDataService,
    private _tokenStorageService: TokenStorageService,
    private _notificationService: NotificationService,
    private _regService: RegistrationDataService
  ) {
    _iconRegistry.addSvgIcon(
      'streamweb3',
      _sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/icons/pi_stream_logo.svg'
      )
    );

    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Your code to handle the route change event here
        this._notificationService.clearNotification();
      });
  }

  ngOnInit(): void {
    this._isLoggedIn = !!this._tokenStorageService.getToken();

    this._authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this._isAuthenticated = isAuthenticated;
    });

    this._existingAppMode = this.$appModeArr[0].toString();

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this._activatedRoute.snapshot),
        map((snapshot) => snapshot.firstChild),
        map((child) => {
          // Traverse the route tree to get the route path
          while (child?.firstChild) {
            child = child.firstChild;
          }
          return child?.routeConfig?.path;
        })
      )
      .subscribe((path) => {
        // Update the variable to show/hide the button
        this._isHomeRoute = path === 'index';
      });
  }

  onToggleChange($event: any) {
    this._existingAppMode = $event.checked
      ? this.$appModeArr[1]
      : this.$appModeArr[0];

    if ($event.checked == true) {
      this._router.navigateByUrl('/studio');
    } else {
      this._router.navigateByUrl('/list');
    }
  }

  register(): void {
    this._router.navigateByUrl('/user/register');
  }

  connect(): void {
    this.isBusy = true;
    Pi_Authentication(
      this._authService,
      this._tokenStorageService,
      this._regService,
      this._notificationService
    )
      .then((result) => {
        this.isBusy = false;
        console.log(result);
      })
      .catch((error) => {
        this.isBusy = false;
      });
  }

  signOut = () => {
    this._authService.signOut();
    this._router.navigateByUrl('/user/logout');
  };
}

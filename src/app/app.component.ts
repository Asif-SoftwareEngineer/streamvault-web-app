import * as PiModel from './models/pi-model';

import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { Observable, filter, map, tap } from 'rxjs';

import { AuthDataService } from 'src/app/services/auth-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MenuItem } from './models/menu';
import { NotificationService } from './services/notification.service';
import { Pi_Authentication } from './shared/pi-auth-payments';
import { Role } from './models/enums';
import { Router } from '@angular/router';
import { TokenStorageService } from './services/token-storage.service';
import { UiService } from './common/ui.service';
import { User } from './models/user';
import { UserDataService } from './services/user-data.service';

//import { RegistrationDataService } from './services/registration.service';

interface CustomWindow extends Window {
  Pi: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  activeNavigationButton: string = '';

  protected navMenuItems!: MenuItem[];

  onSidenavOpen() {
    //this.isSidenavOpen = true;
  }

  onSidenavClose() {
    if (this.activeNavigationButton === 'menu') {
      this.uiService.navigationButtonSelected.next('sideNavClosed');
    }
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
    if (!this.sidenav.opened) {
      console.log('closed');
    }
  }

  registerMember() {
    this.sidenav.close();
    setTimeout(() => {
      this._router.navigateByUrl('user/register-member');
    }, 2000);
  }

  menuItemClicked(menuItem: MenuItem) {
    console.log(menuItem);
    this.sidenav.close();
    this.uiService.navigationButtonSelected.next('routedOutside');
    if (menuItem.menuName.toLowerCase() === 'my profile') {
      const myProfileUrl: string = `${menuItem.url}648b46adfd79ae08df75fd8c`;
      this._router.navigateByUrl(myProfileUrl);
    } else {
      this._router.navigateByUrl(menuItem.url);
    }
  }

  _title: string = 'streamvault';
  _existingAppMode: string = '';
  _isHomeRoute: boolean = false;
  private _isAuthenticated: boolean = false;
  _accessToken: string = '';
  _regUserData$!: Observable<{ user: User; userType: string }>;
  _isLoggedIn: boolean = false;
  isBusy = false;

  _windowRef = window as unknown as CustomWindow;

  $appModeArr: string[] = ['Stream', 'Studio'];

  constructor(
    private uiService: UiService,
    private userService: UserDataService,
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _dialog: MatDialog,
    private _authService: AuthDataService,
    private _tokenStorageService: TokenStorageService,
    private _notificationService: NotificationService //private _regService: RegistrationDataService
  ) {
    _iconRegistry.addSvgIcon(
      'streamvault',
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
    const userId: string = '648b46adfd79ae08df75fd8c';
    this.userService.getMenus(userId).subscribe((menus: MenuItem[]) => {
      this.navMenuItems = menus;
    });

    this._isLoggedIn = !!this._tokenStorageService.getPiToken();

    if (this._isLoggedIn) {
      this._authService.setIsAuthenticated(true);
    }

    this._authService.isAuthenticated$
      .pipe(
        tap((isAuthenticated) => {
          this._isAuthenticated = isAuthenticated;
        })
      )
      .subscribe();

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

    this.uiService.navigationButtonSelected.subscribe((value) => {
      console.log(value);
      this.activeNavigationButton = value;
      // if (value === 'routedOutside') {
      //   this.uiService.navigationButtonSelected.next('');
      // } else {
      //   this.uiService.navigationButtonSelected.next('sideNavClosed');
      // }
    });
  }

  get isAuthenticated() {
    return this._isAuthenticated;
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
    // this.isBusy = true;
    // Pi_Authentication(
    //   this._authService,
    //   this._tokenStorageService
    //   //this._regService
    //   //this._notificationService
    // )
    //   .then((result) => {
    //     this.isBusy = false;
    //   })
    //   .catch((error) => {
    //     this.isBusy = false;
    //   });
  }

  signOut = () => {
    const currentUser: any = this._tokenStorageService.getPiUser();

    this._authService.signOut(currentUser.uid);
    this._router.navigateByUrl('/user/logout');
  };
}

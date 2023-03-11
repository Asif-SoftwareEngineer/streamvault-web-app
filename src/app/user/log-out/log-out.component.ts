import * as PiModel from 'src/app/models/pi-model';

import { Component, OnInit } from '@angular/core';
import {
  INotification,
  NotificationService,
} from 'src/app/services/notification.service';

import { AuthDataService } from 'src/app/services/auth-data.service';
import { IUser } from 'src/app/models/user';
import { NotificationType } from 'src/app/shared/enums';
import { PiNetworkService } from 'src/app/services/PiNetwork.service';
import { Pi_Authentication } from 'src/app/shared/pi-auth-payments';
import { Role } from 'src/app/models/enums';
import { Router } from '@angular/router';

interface CustomWindow extends Window {
  Pi: any;
}

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css'],
})
export class LogOutComponent implements OnInit {
  _windowRef = window as unknown as CustomWindow;
  _isAuthenticated: boolean = false;
  _iSeconds: number = 3;
  counter = 3;
  timer: any;

  _notification: INotification = {
    message: '',
    type: 'none',
    timestamp: new Date(),
  };
  private _regService: any;

  constructor(
    private _authService: AuthDataService,
    private _router: Router,
    private _notificationService: NotificationService
  ) {
    this._authService.setIsAuthenticated(false);
  }

  ngOnInit(): void {
    this._authService.setIsAuthenticated(false);
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.counter--;
      if (this.counter === 0) {
        clearInterval(this.timer);
        this._router.navigateByUrl('/index');
      }
    }, 1000);
  }

  connectWithPiNetwork(): void {
    // Pi_Authentication()
    //   .then((result) => {
    //     console.log(result.isConnected);
    //     console.log(result.authResult);
    //     const authResult = result.authResult;
    //     this._authService.setIsAuthenticated(true);
    //     this._authService.setAuthResult(authResult!);
    //     this._regService
    //       .getUser(
    //         authResult!.accessToken,
    //         authResult!.user.uid,
    //         authResult!.user.username
    //       )
    //       .subscribe({
    //         next: (registeredUser: IUser) => {
    //           this._regService.setRegisteredUserSubject(registeredUser);
    //         },
    //         error: (error: Error) => {
    //           this._regService.setRegisteredUserSubject({
    //             streamweb3_username: '',
    //             email: '',
    //             country: '',
    //             role: Role.None,
    //             isProfileDisabled: false,
    //           });
    //         },
    //       });
    //   })
    //   .catch((error) => {
    //     console.log(error.isConnected);
    //     console.log(error.authResult);
    //     const notification = {
    //       message: 'Connecting Pi Blockchain failed, Please try later!',
    //       type: NotificationType.Error,
    //       timestamp: new Date(),
    //     };
    //     this._notificationService.addNotification(notification);
    //   });
  }
}

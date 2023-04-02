import * as PiModel from 'src/app/models/pi-model';

import { Component, OnInit } from '@angular/core';
import {
  INotification,
  NotificationService,
} from 'src/app/services/notification.service';

import { AuthDataService } from 'src/app/services/auth-data.service';
import { IUser } from 'src/app/models/user';
import { NotificationType } from 'src/app/shared/enums';
import { Pi_Authentication } from 'src/app/shared/pi-auth-payments';
import { Role } from 'src/app/models/enums';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';

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
  _isBusy: boolean = false;

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
    private _notificationService: NotificationService,
    private _tokenStorageService: TokenStorageService
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
    this._isBusy = true;
    Pi_Authentication(
      this._authService,
      this._tokenStorageService,
      this._regService,
      this._notificationService
    )
      .then((result) => {
        this._isBusy = false;
        console.log(result);
      })
      .catch((error) => {
        this._isBusy = false;
      });
  }
}

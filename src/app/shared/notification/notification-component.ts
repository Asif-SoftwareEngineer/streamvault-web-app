import { Component, OnInit } from '@angular/core';
import {
  Notification,
  NotificationService,
} from 'src/app/services/notification.service';
import { Observable, startWith } from 'rxjs';

import { NotificationType } from '../enums';

//import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notification',
  template: `
    <div
      *ngIf="notification$ | async as notification"
      [ngClass]="notification.type"
    >
      {{ notification.message }}
    </div>
  `,
  styles: [
    `
      div {
        width: 90%;
        padding: 10px;
        border-radius: 5px;
        fxlayoutalign: space-around center;
      }
      .success {
        background-color: green;
        color: white;
      }
      .error {
        background-color: red;
        color: white;
      }
      .warn {
        background-color: orange;
        color: white;
      }
    `,
  ],
})
export class NotificationComponent implements OnInit {
  notification$: Observable<Notification> | undefined;

  constructor(private _notificationService: NotificationService) {
    this._notificationService.clearNotification();
  }

  ngOnInit() {
    this.notification$ = this._notificationService.notification$;
  }
}

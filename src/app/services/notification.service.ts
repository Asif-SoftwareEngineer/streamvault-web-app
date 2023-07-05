import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationType } from '../shared/enums';

export interface Notification {
  message: string;
  type: 'error' | 'success' | 'warn' | 'none';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notification = new BehaviorSubject<Notification>({
    message: '',
    type: NotificationType.None,
    timestamp: new Date(),
  });

  public notification$ = this._notification.asObservable();

  addNotification(notification: Notification) {
    this._notification.next(notification);
    setTimeout(() => {
      this._notification.next({
        message: '',
        type: 'none',
        timestamp: new Date(),
      });
    }, 3500);
  }

  clearNotification() {
    //this._notification.next(null);
  }
}

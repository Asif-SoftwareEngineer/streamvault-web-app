import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationType } from '../shared/enums';

export interface INotification {
  message: string;
  type: 'error' | 'success' | 'warn' | 'none';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notification = new BehaviorSubject<INotification>({
    message: '',
    type: NotificationType.None,
    timestamp: new Date(),
  });

  public notification$ = this._notification.asObservable();

  addNotification(notification: INotification) {
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

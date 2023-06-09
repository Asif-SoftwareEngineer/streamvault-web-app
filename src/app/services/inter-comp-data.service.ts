import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterComponentDataService {
  private emailSentStatusSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private emailSentButExpiredStatusSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isMessageSent$ = this.emailSentStatusSubject.asObservable();
  public isMessageSentButExpired$ =
    this.emailSentButExpiredStatusSubject.asObservable();

  messageSentToMobile(flag: boolean) {
    this.emailSentStatusSubject.next(flag);
  }

  messageSentToMobileExpired(flag: boolean) {
    this.emailSentStatusSubject.next(flag);
  }
}

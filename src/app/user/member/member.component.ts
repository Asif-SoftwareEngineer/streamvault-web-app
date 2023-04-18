import * as PiModel from 'src/app/models/pi-model';

import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  INotification,
  NotificationService,
} from 'src/app/services/notification.service';
import { MembershipType, Role } from 'src/app/models/enums';
import {
  PI_Payments,
  Pi_Authentication,
  approvalEvent,
  cancelEvent,
  completionEvent,
  errorEvent,
  incompleteEvent,
} from 'src/app/shared/pi-auth-payments';

import { AuthDataService } from 'src/app/services/auth-data.service';
import { IUser } from 'src/app/models/user';
import { NotificationType } from 'src/app/shared/enums';
import { RegistrationDataService } from 'src/app/services/registration.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { timeout } from 'rxjs';

// import {
//   appMaxLenghtValidator,
//   appMinLengthValidator,
// } from 'src/app/shared/customValidators';

interface CustomWindow extends Window {
  Pi: any;
}

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit, AfterViewInit {
  _membershipForm: FormGroup = this._fb.group({});
  _isAuthenticated: boolean = false;
  _windowRef = window as unknown as CustomWindow;

  _membershipTypeSelected: MembershipType | null = null;
  _userType: string = 'visitor';
  _isBusy: boolean = false;

  _notification: INotification = {
    message: '',
    type: 'none',
    timestamp: new Date(),
  };

  _showInputControl: boolean = false;
  _amount: number = 0;

  protected _registeredUser: IUser | null = null;

  constructor(
    private _authService: AuthDataService,
    private _fb: FormBuilder,
    private _notificationService: NotificationService,
    private _router: Router,
    private _regService: RegistrationDataService,
    private _tokenStorageService: TokenStorageService
  ) {
    this._authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this._isAuthenticated = isAuthenticated;
    });
  }

  ngOnInit(): void {
    approvalEvent.subscribe((data) => {
      // Handle the UI based on the trigger of the event
    });

    completionEvent.subscribe((data) => {
      // Handle the UI based on the trigger of the event
      if (data.status == 200) {
        const notification = {
          message: data.message,
          type: NotificationType.Success,
          timestamp: new Date(),
        };
        setTimeout(() => {
          this._router.navigateByUrl('/studio');
        }, 3500);
        this._notificationService.addNotification(notification);
      }
    });

    cancelEvent.subscribe((data) => {
      // Handle the UI based on the trigger of the event
      console.log(data);
      if (data.status == 200) {
        const notification = {
          message: data.message,
          type: NotificationType.Warn,
          timestamp: new Date(),
        };
        this._notificationService.addNotification(notification);
      }
    });

    errorEvent.subscribe((data) => {
      // Handle the UI based on the trigger of the event
      console.log(data);
      if (data.status == 200) {
        const notification = {
          message: data.message,
          type: NotificationType.Error,
          timestamp: new Date(),
        };
        this._notificationService.addNotification(notification);
      }
    });

    incompleteEvent.subscribe((data) => {
      // Handle the UI based on the trigger of the event
      if (data.status == 200) {
        const notification = {
          message: data.message,
          type: NotificationType.Success,
          timestamp: new Date(),
        };
        setTimeout(() => {
          this._router.navigateByUrl('/studio');
        }, 3500);
        this._notificationService.addNotification(notification);
      }
    });

    this._regService.getRegisteredUserSubject().subscribe((registeredUser) => {
      this._showInputControl = false;
      if (registeredUser && registeredUser.role == Role.User) {
        this._registeredUser = registeredUser;
        this._userType = registeredUser.role;
        this.makeInputControlsAsReadonly();
        this.populateFields();
      } else if (registeredUser && registeredUser.role == Role.Member) {
        this._registeredUser = registeredUser;
        this._userType = 'member';
      } else if (
        registeredUser &&
        (registeredUser.role == Role.None ||
          registeredUser.role == Role.Visitor)
      ) {
        this._registeredUser = registeredUser;
        this._userType = registeredUser.role;
      }
    });

    this._membershipForm = this._fb.group({
      streamvault_username: [
        '',
        // [
        //   Validators.required,
        //   appMinLengthValidator(5, 'Please enter at least [5] characters.'),
        //   appMaxLenghtValidator(
        //     20,
        //     'Please enter no more than [20] characters.'
        //   ),
        // ],
      ],
      email: ['', [Validators.required, Validators.email]],
      country: [
        '',
        // [
        //   Validators.required,
        //   appMinLengthValidator(4, 'Please enter at least [4] characters.'),
        //   appMaxLenghtValidator(
        //     20,
        //     'Please enter no more than [30] characters.'
        //   ),
        // ],
      ],
      city: [
        '',
        // [
        //   Validators.required,
        //   appMinLengthValidator(4, 'Please enter at least [4] characters.'),
        //   appMaxLenghtValidator(
        //     20,
        //     'Please enter no more than [30] characters.'
        //   ),
        // ],
      ],
      membershipType: new FormControl('2'),
    });
  }

  makeInputControlsAsReadonly() {
    if (this._registeredUser) {
      const formValue = this._membershipForm.getRawValue();

      // Loop through all the controls in the form
      Object.keys(formValue).forEach((key) => {
        const control = this._membershipForm.get(key);

        if (
          control instanceof FormControl &&
          control !== this._membershipForm.get('membershipType')
        ) {
          // Set the control to readonly
          control.disable({ onlySelf: true });
        }
      });
    }
  }

  populateFields() {
    if (this._registeredUser?.role !== 'none') {
      console.log(this._registeredUser);
      const user = this._registeredUser;
      console.log(this._membershipForm);
      this._membershipForm.controls['streamvault_username'].setValue(
        user?.streamvault_username
      );
      this._membershipForm.controls['email'].setValue(user?.email);
      this._membershipForm.controls['country'].setValue(user?.country);
      this._membershipForm.controls['city'].setValue(user?.city);
    }
  }

  ngAfterViewInit(): void {
    if (this._membershipForm) {
      this._membershipForm
        .get('membershipType')!
        .valueChanges.subscribe((value) => {
          switch (value) {
            case '1':
              this._membershipTypeSelected = MembershipType.Monthly;
              this._amount = 0.1;
              break;
            case '2':
              this._membershipTypeSelected = MembershipType.Quarterly;
              this._amount = 0.25;
              break;
            case '3':
              this._membershipTypeSelected = MembershipType.SemiAnnually;
              this._amount = 0.49;
              break;
            case '4':
              this._membershipTypeSelected = MembershipType.Annually;
              this._amount = 0.9;
              break;
            default:
              break;
          }
        });
    }
  }

  onSubmit(): void {
    const userId: string = this._tokenStorageService.getPiUser().uid;
    const userName: string = this._tokenStorageService.getPiUser().username;
    const accessCode: string = this._tokenStorageService.getPiToken()!;

    if (!userId || !userName || !accessCode) {
      console.log('Token storage with invalid values');
      return;
    }

    let membershipDTO: IUser;

    if (userId && accessCode) {
      membershipDTO = {
        userId: userId,
        accessCode: accessCode,
        pichain_uid: userId,
        pichain_username: userName,

        // streamvault_username:
        //   this._membershipForm.controls['streamvault_username'].value,
        // email: this._membershipForm.controls['email'].value,
        // country: this._membershipForm.controls['country'].value,
        // city: this._membershipForm.controls['city'].value,

        streamvault_username: 'NA',
        email: 'NA',
        country: 'NA',
        city: 'NA',

        isProfileDisabled: false,
        role: Role.Member,
        registration_date: new Date(),
        membership_date: new Date(),
        membership_Type: this._membershipTypeSelected?.toString().toLowerCase(),
      };

      // Start payment process and user join process.

      const metaData: PiModel.MyPaymentMetadata = membershipDTO;

      PI_Payments(this._amount, 'Creating a user membership', metaData);
    }
  }

  goBack() {
    this._router.navigateByUrl('/index');
  }

  connectWithPiNetwork = () => {
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
  };
}

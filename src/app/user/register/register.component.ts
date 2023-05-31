import * as PiModel from 'src/app/models/pi-model';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  INotification,
  NotificationService,
} from 'src/app/services/notification.service';

import { AuthDataService } from 'src/app/services/auth-data.service';
import { IUser } from 'src/app/models/user';
import { NgForm } from '@angular/forms';
import { NotificationType } from 'src/app/shared/enums';
import { Observable } from 'rxjs';
import { Pi_Authentication } from 'src/app/shared/pi-auth-payments';
import { Role } from 'src/app/models/enums';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';

interface CustomWindow extends Window {
  Pi: any;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('myRegForm') regForm: NgForm | null = null;
  @ViewChild('registerButton')
  registerButton: HTMLButtonElement | null = null;
  @ViewChild('cancelButton') cancelButton: HTMLButtonElement | null = null;
  protected _registeredUser: IUser | null = null;

  _registrationForm: FormGroup = this._fb.group({});
  _isAuthenticated: boolean = false;
  _windowRef = window as unknown as CustomWindow;
  _isBusy: boolean = false;
  _notification: INotification = {
    message: '',
    type: 'none',
    timestamp: new Date(),
  };

  constructor(
    private _authService: AuthDataService,
    private _fb: FormBuilder,
    private _notificationService: NotificationService,
    private _router: Router,
    private _tokenStorageService: TokenStorageService //private _regService: RegistrationDataService
  ) {
    this._authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this._isAuthenticated = isAuthenticated;
    });
  }

  ngOnInit(): void {
    // this._regService.getRegisteredUserSubject().subscribe((registeredUser) => {
    //   console.log('calling the registered user subject');
    //   console.log(registeredUser);
    //   this._registeredUser = registeredUser;
    // });
    // this._registrationForm = this._fb.group({
    //   streamvault_username: [
    //     '',
    //     [
    //       Validators.required,
    //       appMinLengthValidator(5, 'Please enter at least [5] characters.'),
    //       appMaxLenghtValidator(
    //         20,
    //         'Please enter no more than [20] characters.'
    //       ),
    //     ],
    //   ],
    //   email: ['', [Validators.required, Validators.email]],
    //   country: [
    //     '',
    //     [
    //       Validators.required,
    //       appMinLengthValidator(4, 'Please enter at least [4] characters.'),
    //       appMaxLenghtValidator(
    //         20,
    //         'Please enter no more than [30] characters.'
    //       ),
    //     ],
    //   ],
    //   city: [
    //     '',
    //     [
    //       Validators.required,
    //       appMinLengthValidator(4, 'Please enter at least [4] characters.'),
    //       appMaxLenghtValidator(
    //         20,
    //         'Please enter no more than [30] characters.'
    //       ),
    //     ],
    //   ],
    // });
  }

  onSubmit(): void {
    // this.regForm?.form.enable();
    // const userId: string = this._tokenStorageService.getPiUser().uid;
    // const userName: string = this._tokenStorageService.getPiUser().username;
    // const accessCode: string = this._tokenStorageService.getPiToken()!;
    // if (!userId || !userName || !accessCode) {
    //   console.log('Token storage with invalid values');
    //   return;
    // }
    // const registrationDTO: IUser = {
    //   accessCode: accessCode,
    //   pichain_uid: userId,
    //   pichain_username: userName,
    //   name: this._registrationForm.controls['streamvault_username'].value,
    //   email: this._registrationForm.controls['email'].value,
    //   //country: this._registrationForm.controls['country'].value,
    //   //city: this._registrationForm.controls['city'].value,
    //   isProfileDisabled: false,
    //   role: Role.User,
    //   registration_date: new Date(),
    // };
    // this.regForm?.form.disable();
    // this.registerButton!.disabled = true;
    // this.cancelButton!.disabled = true;
    // this._regService.registerAsUser(registrationDTO).subscribe(
    //   (response) => {
    //     if (response.status == 200) {
    //       this._notification = {
    //         message: response.Message,
    //         type: 'success',
    //         timestamp: new Date(),
    //       };
    //     }
    //     setTimeout(() => {
    //       this._router.navigateByUrl('/studio/home');
    //     }, 4000);
    //     this._notificationService.addNotification(this._notification);
    //   },
    //   (responseError) => {
    //     this._notification = {
    //       message: responseError.error.message,
    //       type: 'error',
    //       timestamp: new Date(),
    //     };
    //     this.regForm?.form.enable();
    //     this.registerButton!.disabled = false;
    //     this.cancelButton!.disabled = false;
    //     this._notificationService.addNotification(this._notification);
    //   }
    // );
  }

  goBack() {
    this._router.navigateByUrl('/index');
  }

  connectWithPiNetwork = () => {
    this._isBusy = true;
    Pi_Authentication(
      this._authService,
      this._tokenStorageService,
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

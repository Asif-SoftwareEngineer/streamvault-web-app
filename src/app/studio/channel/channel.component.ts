import {} from '@angular/core';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  INotification,
  NotificationService,
} from 'src/app/services/notification.service';
import {
  appMaxLenghtValidator,
  appMinLengthValidator,
} from 'src/app/shared/customValidators';

import { ChannelDataService } from 'src/app/services/channelData.service';
import { IChannel } from 'src/app/models/channel';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit, AfterViewInit {
  @ViewChild('saveButton')
  saveButton: HTMLButtonElement | null = null;
  @ViewChild('cancelButton') cancelButton: HTMLButtonElement | null = null;

  _channelForm: FormGroup = this.fb.group({});
  _notification: INotification = {
    message: '',
    type: 'none',
    timestamp: new Date(),
  };
  isFormSaved: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _channelService: ChannelDataService,
    private _notificationService: NotificationService,
    private _tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    this._channelForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          appMinLengthValidator(4, 'Please enter at least [4] characters.'),
          appMaxLenghtValidator(
            20,
            'Please enter no more than [20] characters.'
          ),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          appMinLengthValidator(10, 'Please enter at least [10] characters.'),
          appMaxLenghtValidator(
            200,
            'Please enter no more than [200] characters.'
          ),
        ],
      ],
      category: [
        '',
        [
          Validators.required,
          appMinLengthValidator(4, 'Please enter at least [4] characters.'),
          appMaxLenghtValidator(
            20,
            'Please enter no more than [20] characters.'
          ),
        ],
      ],
      handle: [
        '',
        [
          Validators.required,
          appMinLengthValidator(4, 'Please enter at least [4] characters.'),
          appMaxLenghtValidator(
            15,
            'Please enter no more than [15] characters.'
          ),
        ],
      ],
      tags: [
        '',
        [
          Validators.required,
          appMinLengthValidator(4, 'Please enter at least [4] characters.'),
          appMaxLenghtValidator(
            30,
            'Please enter no more than [30] characters.'
          ),
        ],
      ],
      privacySubscribers: [false],
    });
  }

  ngAfterViewInit(): void {}

  onSubmit() {
    const currentUser: any = this._tokenStorage.getUser();
    const userId = currentUser.uid;

    const channelFormData = this._channelForm.value;
    this._channelService.addChannel(channelFormData, userId).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status == 200) {
          this._notification = {
            message: 'Channel has been created successfully.',
            type: 'success',
            timestamp: new Date(),
          };
        }
        setTimeout(() => {
          this._router.navigateByUrl('/studio');
        }, 3700);
        if (this.saveButton) {
          this.saveButton.disabled = true;
        }
        if (this.cancelButton) {
          this.cancelButton.disabled = true;
        }
        this._notificationService.addNotification(this._notification);
      },
      error: (responseError) => {
        this._notification = {
          message: '',
          type: 'error',
          timestamp: new Date(),
        };

        switch (responseError.status) {
          case 400:
            this._notification.message = responseError.error.message;
            break;
          case 404:
            this._notification.message = responseError.error.message;
            break;
          case 409: {
            this._notification.message = responseError.error.message;
            break;
          }
          default:
            this._notification.message = 'Failed to create channel.';
        }

        if (this.saveButton) {
          this.saveButton.disabled = true;
        }
        if (this.cancelButton) {
          this.cancelButton.disabled = true;
        }
        this.isFormSaved = true;
        this._notificationService.addNotification(this._notification);
      },
    });
  }

  goBack() {
    this._router.navigateByUrl('/studio/home');
  }
}

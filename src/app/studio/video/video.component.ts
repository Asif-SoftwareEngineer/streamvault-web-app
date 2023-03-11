import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  INotification,
  NotificationService,
} from 'src/app/services/notification.service';
import {
  appMaxLenghtValidator,
  appMinLengthValidator,
} from 'src/app/shared/customValidators';
import { filter, map, switchMap, take, tap } from 'rxjs';

import { ChannelDataService } from 'src/app/services/channelData.service';
import { FileUploadComponent } from 'src/app/shared/file-upload/file-upload.component';
import { IChannel } from 'src/app/models/channel';
import { IVideo } from 'src/app/models/video';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VideoDataService } from 'src/app/services/videosData.service';

interface ChannelSelection {
  channelId: string;
  name: string;
}

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  @ViewChild('publishButton')
  publishButton: HTMLButtonElement | null = null;
  @ViewChild('fileUploadRef') fileUploadComponent: FileUploadComponent | null =
    null;

  _videoForm: FormGroup = this._fb.group({});
  _selectedFile: File | null = null;
  _uploadFileProgress: number = 0;
  _channelIdAndNameArray: ChannelSelection[] = [];
  _selectedChannelId: string = '';

  _notification: INotification = {
    message: '',
    type: 'none',
    timestamp: new Date(),
  };

  _isFormSaved: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _channelDataService: ChannelDataService,
    private _videoService: VideoDataService,
    private _notificationService: NotificationService,
    private _tokenStorage: TokenStorageService,
    private _router: Router
  ) {}

  ngOnInit() {
    const userId: string = this._tokenStorage.getUser().uid;

    this._channelDataService
      .getChannelsByUserId(userId)
      .subscribe((channelsData: IChannel[]) => {
        //const channelList = channelsData['channels'];
        console.log(channelsData);

        this._channelIdAndNameArray = channelsData.map((channel) => {
          return {
            channelId: channel.channelId,
            name: channel.name,
          };
        });
      });

    this._videoForm = this._fb.group({
      title: [
        '',
        [
          Validators.required,
          appMinLengthValidator(5, 'Please enter at least [5] characters.'),
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
      channel: ['', [Validators.required]],
    });

    this._videoForm.controls['channel'].valueChanges.subscribe((value) => {
      console.log('Selected channel:', value);
      this._selectedChannelId = value;
      // Do something with the selected channel value
    });
  }

  onSubmit() {
    const currentUser: any = this._tokenStorage.getUser();
    const userId = currentUser.uid;

    this.videoFileAndDataUploadFunctions(
      userId,
      this._selectedChannelId
    )?.subscribe(
      (responseSuccess) => {
        if (responseSuccess.status == 200) {
          this._isFormSaved = true;
          this._notification = {
            message:
              'Uploaded successfully. This will be published soon after its verification.',
            type: 'success',
            timestamp: new Date(),
          };
        }

        setTimeout(() => {
          this._router.navigateByUrl('/studio/home');
        }, 3500);

        this._notificationService.addNotification(this._notification);
      },
      (responseError) => {
        this._isFormSaved = false;
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
            this._notification.message = 'Failed to publish video.';
        }
        this._notificationService.addNotification(this._notification);
      }
    );
  }

  videoFileAndDataUploadFunctions(userId: string, channelId: string) {
    return this.fileUploadComponent?.uploadVideo(userId, channelId).pipe(
      tap((progress) => {
        this._uploadFileProgress = progress.progress;
      }),
      filter(
        (progress) => progress.progress === 100 && progress.fileHandle !== null
      ),
      take(1),
      map((progress) => {
        const videoFormData: IVideo = {
          userId: userId,
          title: this._videoForm.controls['title'].value,
          description: this._videoForm.controls['description'].value,
          category: this._videoForm.controls['category'].value,
          tags: this._videoForm.controls['tags'].value,
          channelId: channelId,
          videoId: 'new_id',
          filePath: progress.fileHandle,
          url: '',
        };
        return videoFormData;
      }),
      take(1),
      switchMap((videoFormData) => {
        console.log('Calling the videoService.addVideo method');
        return this._videoService.addVideo(videoFormData);
      })
    );
  }

  goBack() {
    this._router.navigateByUrl('/studio/home');
  }
}

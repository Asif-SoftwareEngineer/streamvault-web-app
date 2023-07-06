import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { UiService } from 'src/app/common/ui.service';
import { VideoDataService } from 'src/app/services/videos-data.service';

@Component({
  selector: 'app-upload',
  templateUrl: './pre-upload.component.html',
  styleUrls: ['./pre-upload.component.scss'],
})
export class PreUploadComponent implements OnInit, OnDestroy {
  private videoUrlSubscription: Subscription | undefined;
  private videoThumbnailSubscription: Subscription | undefined;
  protected videoUrl: string = '';
  protected thumbnail: string = '';

  constructor(
    private uiService: UiService,
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoDataService
  ) {}

  ngOnInit() {
    this.videoUrlSubscription = this.videoService
      .getVideoBase64()
      .subscribe((url: string) => {
        // Use the video URL
        this.videoUrl = url;
      });

    this.videoThumbnailSubscription = this.videoService
      .getThumbnailBase64()
      .subscribe((thumbnail: string) => {
        this.thumbnail = thumbnail;
      });
  }

  ngOnDestroy() {
    if (this.videoUrlSubscription) {
      console.log('subject destroyed');
      this.videoUrlSubscription.unsubscribe();
    }
  }

  initiateVideoUploadProcess() {
    const dialogMessgePara1 = `We will start the process of uploading your video. It is important to ensure that your video content adheres to the StreamVault community guidelines.`;
    const dialogMessgePara2 = `Do you want to proceed!`;
    this.uiService
      .showDialog(
        'Video Upload',
        dialogMessgePara1,
        dialogMessgePara2,
        'Yes',
        'No'
      )
      .subscribe((result: boolean) => {
        if (result) {
          // User clicked on "Yes" button
          // Execute your functionality here
          console.log('user has clicked the yes button');
          if (this.videoUrl && this.thumbnail) {
            this.videoService
              .uploadVideo(
                '648b46adfd79ae08df75fd8c',
                '4bdcab987658f89c5a61242c',
                this.thumbnail,
                this.videoUrl
              )
              .subscribe({
                next: (success) => {
                  if (success === true) {
                    this.router.navigateByUrl('studio/upload-vid-details');
                  }
                  // Handle the success scenario
                },
                error: (error) => {
                  if (error.status === 404) {
                    this.uiService.showToast(error.error.errorMessage, 2000);
                  }
                  console.error('Error uploading video:', error);
                  // Handle the error scenario
                },
              });
          }
        } else {
          // User clicked on "No" button
          // Execute other functionality here
          console.log('user has clicked the no button');
        }
      });
  }
}

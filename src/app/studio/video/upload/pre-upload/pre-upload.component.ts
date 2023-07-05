import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { VideoDataService } from 'src/app/services/videos-data.service';

@Component({
  selector: 'app-upload',
  templateUrl: './pre-upload.component.html',
  styleUrls: ['./pre-upload.component.scss'],
})
export class PreUploadComponent implements OnInit, OnDestroy {
  private videoUrlSubscription: Subscription | undefined;
  videoUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoDataService
  ) {}

  ngOnInit() {
    this.videoUrlSubscription = this.videoService
      .getVideoUrl()
      .subscribe((url: string) => {
        // Use the video URL
        this.videoUrl = url;
      });
  }

  ngOnDestroy() {
    if (this.videoUrlSubscription) {
      console.log('subject destroyed');
      this.videoUrlSubscription.unsubscribe();
    }
  }
}

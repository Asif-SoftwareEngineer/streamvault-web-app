import { ActivatedRoute, Route } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Video } from 'src/app/models/video';
import { VideoDataService } from 'src/app/services/videos-data.service';
import { VideoPublishStage } from 'src/app/models/enums';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-info',
  templateUrl: './video-info.component.html',
  styleUrls: ['./video-info.component.scss'],
})
export class VideoInfoComponent implements OnInit {
  protected videoObj!: Video;
  protected status: string = '';
  protected serverUrl: string = '';

  constructor(
    private videoService: VideoDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.serverUrl = environment.api.serverUrl;
    const videoId = this.route.snapshot.params['identifier'];

    console.log(videoId);

    this.videoService.getVideoById(videoId).subscribe({
      next: (response: any) => {
        this.videoObj = response.video;
        if (
          this.videoObj.publishStage === VideoPublishStage.InformationAdded ||
          this.videoObj.publishStage === VideoPublishStage.UnderReview
        ) {
          this.status = 'Under Review';
        }
      },
      error: (responseError) => {
        console.error('Error:', responseError);
      },
    });
  }
}

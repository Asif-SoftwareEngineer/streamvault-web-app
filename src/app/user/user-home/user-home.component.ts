import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { VideoDataService } from 'src/app/services/videos-data.service';
import { VideoView } from 'src/app/models/video';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
})
export class UserHomeComponent implements OnInit {
  protected videos: VideoView[] = [];
  protected serverUrl: string = '';

  constructor(private videoService: VideoDataService, private router: Router) {}

  ngOnInit(): void {
    this.serverUrl = environment.api.serverUrl;

    this.videoService.getAllVideos().subscribe({
      next: (data: VideoView[]) => {
        console.log(data);
        this.videos = [...data]; // Assign the data as an array
      },
      error: (responseError) => {},
    });
  }

  handleImageError(event: any): void {
    event.target.src =
      '../../../assets/img/images/streamvault_video_thumbnail.jpg'; // Set the path to the fallback image
  }

  playThisVideo(video: VideoView) {
    this.videoService.setVideo(video);
    this.router.navigateByUrl('studio/player');
  }
}

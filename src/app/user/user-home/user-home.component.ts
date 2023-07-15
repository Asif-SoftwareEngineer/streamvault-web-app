import { Component, OnInit } from '@angular/core';

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

  constructor(private videoService: VideoDataService) {}

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
}

import { Component, OnInit } from '@angular/core';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VideoDataService } from 'src/app/services/videos-data.service';
import { VideoView } from 'src/app/models/video';
import { environment } from 'src/environments/environment';

export interface IVgDemo {
  label: string;
  src: string;
}

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    CommonModule,
    VgBufferingModule,
    VgControlsModule,
    VgCoreModule,
    VgOverlayPlayModule,
  ],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit {
  videoView!: VideoView;
  preload: string = 'auto';
  api: VgApiService = new VgApiService();
  serverUrl: string = '';
  videoUrl: string = '';
  constructor(
    private route: ActivatedRoute,
    private videoService: VideoDataService
  ) {}

  ngOnInit(): void {
    this.serverUrl = environment.api.serverUrl;

    this.videoService.video$.subscribe((video) => {
      this.videoView = video;
    });

    //this.videoUrl = 'videos/64ae7ae42f5cd28dac43882f.mp4';
  }
  videoPlayerReady(source: VgApiService) {
    this.api = source;
    this.api
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
    this.api
      .getDefaultMedia()
      .subscriptions.ended.subscribe(this.nextVdo.bind(this));
  }
  nextVdo() {}
  initVdo() {
    console.log('playing video');
    this.api.play();
  }
}

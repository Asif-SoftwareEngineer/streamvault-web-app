import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IVideoView } from 'src/app/models/video';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { VideoDataService } from 'src/app/services/videosData.service';
import { VideoStreamingService } from 'src/app/services/videoStreaming.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
})
export class VideoListComponent implements OnInit {
  public _videosList$!: Observable<any>;
  protected _videoUrl: string = '';

  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef | null =
    null;
  isPlay: boolean = false;
  videoUrl: string = '';

  constructor(
    private _videoDataService: VideoDataService,
    private _router: Router,
    private _videoService: VideoStreamingService
  ) {}

  ngOnInit() {
    console.log('about to call  vidz list');

    this._videosList$ = this._videoDataService.getVideosByUserId(
      '2fb08ca8-5b69-4fe7-914e-0201da98e543'
    );
  }

  openVideoDialog(video: IVideoView) {
    this._videoService.setVideo(video);
    this._router.navigateByUrl('studio/player');
  }
}

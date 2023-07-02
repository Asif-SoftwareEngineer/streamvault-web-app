import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { IVideoView } from 'src/app/models/video';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VideoDataService } from 'src/app/services/videos-data.service';
import { VideoStreamingService } from 'src/app/services/video-streaming.service';

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
    private _videoService: VideoStreamingService,
    private _tokenStorageService: TokenStorageService
  ) {}

  ngOnInit() {
    const currentUser: any = this._tokenStorageService.getPiUser() || {};

    if (!currentUser?.uid) {
      currentUser.uid = 'visitor';
    }

    this._videosList$ = this._videoDataService.getAllVideos(currentUser.uid);
  }

  openVideoDialog(video: IVideoView) {
    console.log(video);
    this._videoService.setVideo(video);
    this._router.navigateByUrl('studio/player');
  }
}

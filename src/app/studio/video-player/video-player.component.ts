import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IVideo, IVideoView } from 'src/app/models/video';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VideoStreamingService } from 'src/app/services/videoStreaming.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef | null =
    null;
  _isPlay: boolean = false;
  _video: IVideoView | null = null;

  constructor(
    private _videoService: VideoStreamingService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._videoService
      .getVideo()
      .pipe(take(1))
      .subscribe((video) => {
        this._video = video;
      });
  }

  ngAfterViewInit(): void {
    if (this._video) {
      var myVideo: any = document.getElementById('vidElement');
      this._isPlay = true;
      myVideo.pause();
      setTimeout(() => {
        myVideo.play();
      }, 1500);
    }
  }

  playPause() {
    var myVideo: any = document.getElementById('vidElement');
    if (myVideo.paused) {
      this._isPlay = true;
      myVideo.play();
    } else {
      this._isPlay = false;
      myVideo.pause();
    }
  }

  muteSound() {
    var myVideo: any = document.getElementById('vidElement');
    myVideo.hide = true;
  }

  skip(value: any) {
    let video: any = document.getElementById('vidElement');
    video.currentTime += value;
  }

  restart() {
    let video: any = document.getElementById('vidElement');
    video.currentTime = 0;
  }

  goBack() {
    this._videoService.setVideo(null);
    this._router.navigateByUrl('/list/home');
  }

  ngOnDestroy(): void {
    var myVideo: any = document.getElementById('vidElement');
    if (this._isPlay === true) {
      this._isPlay = false;
      myVideo.pause();
      this._videoService.setVideo(null);
    }
  }
}

import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IVideo } from 'src/app/models/video';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef | null =
    null;
  _isPlay: boolean = false;
  _videoUrl: string = '';
  _videoTitle: string;
  _videoDescription: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IVideo) {
    this._videoUrl = data.url ? data.url : '';
    this._videoTitle = data.title;
    this._videoDescription = data.description;
  }

  ngOnInit(): void {
    var myVideo: any = document.getElementById('my_video_1');
    myVideo.play();
    this._isPlay = true;
  }

  ngAfterViewInit(): void {}

  toggleVideo(event: any) {
    this.videoplayer?.nativeElement.play();
  }
  playPause() {
    var myVideo: any = document.getElementById('my_video_1');
    if (myVideo.paused) {
      myVideo.play();
      this._isPlay = true;
    } else {
      myVideo.pause();
      this._isPlay = false;
    }
  }

  muteSound() {
    var myVideo: any = document.getElementById('my_video_1');
    myVideo.hide = true;
  }

  skip(value: any) {
    let video: any = document.getElementById('my_video_1');
    video.currentTime += value;
  }

  restart() {
    let video: any = document.getElementById('my_video_1');
    video.currentTime = 0;
  }
}

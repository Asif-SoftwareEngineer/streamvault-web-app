import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IVideoView } from 'src/app/models/video';
import { lastValueFrom, take } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VideoDataService } from 'src/app/services/videosData.service';
import { VideoStreamingService } from 'src/app/services/videoStreaming.service';
import { v4 as uuidv4 } from 'uuid';

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
  _liked: boolean = false;
  _disliked: boolean = false;
  _totalLikes: number = 0;
  _totalDislikes: number = 0;

  constructor(
    private _videoService: VideoStreamingService,
    private _videoDataService: VideoDataService,
    private _router: Router,
    private _tokenStorageService: TokenStorageService
  ) {}

  ngOnInit() {
    this._videoService
      .getVideo()
      .pipe(take(1))
      .subscribe((video) => {
        this._video = video;
        if (this._video) {
          this._totalLikes = this._video?.likes;
          this._totalDislikes = this._video?.dislikes;
          this._liked = this._totalLikes > 0 ? true : false;
          this._disliked = this._totalDislikes > 0 ? true : false;
        }
      });
  }

  ngAfterViewInit(): void {
    // if (this._video) {
    //   var myVideo: any = document.getElementById('vidElement');
    //   myVideo.pause();
    //   this._isPlay = true;
    //   setTimeout(() => {
    //     myVideo.play();
    //   }, 1500);
    // }
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

  async expressLike() {
    if (this._liked) {
      if ((await this.withDrawReaction('like')) == true) {
        this._liked = !this._liked;
      }
    } else {
      if ((await this.addReaction('like')) == true) {
        this._liked = !this._liked;
        this._disliked = false;
      }
    }
  }

  async expressDisLike() {
    if (this._disliked) {
      if ((await this.withDrawReaction('dislike')) == true) {
        this._disliked = !this._disliked;
      }
    } else {
      if ((await this.addReaction('dislike')) == true) {
        this._disliked = !this._disliked;
        this._liked = false;
      }
    }
  }

  shareVideo() {}

  reportVideo() {}

  public async addReaction(reactionType: string): Promise<boolean> {
    if (!this._video) {
      throw new Error('No video set');
    }

    const { userId, channelId, videoId } = this._video;
    const currentUser: any = this._tokenStorageService.getUser() || {};

    if (!currentUser?.uid) {
      currentUser.uid = 'visitor';
    }

    try {
      const response = await lastValueFrom(
        this._videoDataService.addReactionToVideo(
          userId,
          channelId,
          videoId,
          currentUser.uid,
          reactionType
        )
      );

      if (response.status === 200) {
        this._totalLikes = response.likes;
        this._totalDislikes = response.dislikes;
      }
      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private async withDrawReaction(reactionType: string): Promise<boolean> {
    if (!this._video) {
      throw new Error('No Video Set');
    }

    const { userId, channelId, videoId } = this._video;
    const currentUser: any = this._tokenStorageService.getUser() || {};

    if (!currentUser?.uid) {
      currentUser.uid = 'visitor';
    }

    try {
      const response = await lastValueFrom(
        this._videoDataService.withdrawReactionToVideo(
          userId,
          channelId,
          videoId,
          currentUser.uid,
          reactionType
        )
      );

      if (response.status === 200) {
        this._totalLikes = response.likes;
        this._totalDislikes = response.dislikes;
      }

      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

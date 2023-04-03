import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { lastValueFrom, take } from 'rxjs';

import { IVideoView } from 'src/app/models/video';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VideoDataService } from 'src/app/services/videosData.service';
import { VideoStreamingService } from 'src/app/services/videoStreaming.service';
import { v4 as uuidv4 } from 'uuid';

export enum Thumb {
  LikeFilled = 'thumb_up_alt',
  LikeEmpty = 'thumb_up_off_alt',
  DislikeFilled = 'thumb_down_alt',
  DislikeEmpty = 'thumb_down_off_alt',
}

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

  _isAppLoggedIn: boolean = false;
  _yourReaction: string = '';
  _watchingUserId: string = '';

  _thumbup: string = '';
  _thumbdown: string = '';

  constructor(
    private _videoService: VideoStreamingService,
    private _videoDataService: VideoDataService,
    private _router: Router,
    private _tokenStorageService: TokenStorageService
  ) {}

  ngOnInit() {
    this._isAppLoggedIn = !!this._tokenStorageService.getPiToken();

    if (this._isAppLoggedIn) {
      this._watchingUserId = this._tokenStorageService.getPiUser().uid;
      console.log('my userId: ' + this._watchingUserId);
    }

    this._videoService
      .getVideo()
      .pipe(take(1))
      .subscribe((video) => {
        this._video = video;
        if (this._video) {
          this._totalLikes = this._video.likes;
          this._totalDislikes = this._video.dislikes;

          if (this._watchingUserId) {
            if (
              this._video.yourReaction.reactionType &&
              this._video.yourReaction.reactingUserId === this._watchingUserId
            ) {
              this._yourReaction = this._video.yourReaction.reactionType;
              console.log('Your Reaction' + this._yourReaction);
            }
          }
          this._liked = this._totalLikes > 0 ? true : false;
          this._disliked = this._totalDislikes > 0 ? true : false;

          if (this._isAppLoggedIn == false) {
            this._thumbup = Thumb.LikeEmpty;
            this._thumbdown = Thumb.DislikeEmpty;
          } else if (this._isAppLoggedIn == true) {
            console.log('we are here');
            console.log('your reaction' + this._yourReaction);
            this._thumbup =
              this._yourReaction === 'like'
                ? Thumb.LikeFilled
                : Thumb.LikeEmpty;
            this._thumbdown =
              this._yourReaction === 'dislike'
                ? Thumb.DislikeFilled
                : Thumb.DislikeEmpty;
          }
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

  // playPause() {
  //   var myVideo: any = document.getElementById('vidElement');
  //   if (myVideo.paused) {
  //     this._isPlay = true;
  //     myVideo.play();
  //   } else {
  //     this._isPlay = false;
  //     myVideo.pause();
  //   }
  // }

  // muteSound() {
  //   var myVideo: any = document.getElementById('vidElement');
  //   myVideo.hide = true;
  // }

  // skip(value: any) {
  //   let video: any = document.getElementById('vidElement');
  //   video.currentTime += value;
  // }

  // restart() {
  //   let video: any = document.getElementById('vidElement');
  //   video.currentTime = 0;
  // }

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
    if (this._isAppLoggedIn && this._watchingUserId) {
      if (this._thumbup === Thumb.LikeEmpty) {
        if ((await this.addReaction('like')) == true) {
          this._thumbup = Thumb.LikeFilled;
          this._thumbdown = Thumb.DislikeEmpty;
        }
      } else if (this._thumbup === Thumb.LikeFilled) {
        if ((await this.withDrawReaction('like')) == true) {
          this._thumbup = Thumb.LikeEmpty;
        }
      }
    } else {
      if ((await this.addReaction('like')) == true) {
        this._thumbup = Thumb.LikeEmpty;
        this._thumbdown = Thumb.DislikeEmpty;
      }
    }
  }

  async expressDisLike() {
    if (this._isAppLoggedIn && this._watchingUserId) {
      if (this._thumbdown === Thumb.DislikeEmpty) {
        if ((await this.addReaction('dislike')) == true) {
          this._thumbdown = Thumb.DislikeFilled;
          this._thumbup = Thumb.LikeEmpty;
        }
      } else if (this._thumbdown === Thumb.DislikeFilled) {
        if ((await this.withDrawReaction('dislike')) == true) {
          this._thumbdown = Thumb.DislikeEmpty;
        }
      }
    } else {
      if ((await this.addReaction('dislike')) == true) {
        this._thumbup = Thumb.LikeEmpty;
        this._thumbdown = Thumb.DislikeEmpty;
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
    const currentUser: any = this._tokenStorageService.getPiUser() || {};

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
    const currentUser: any = this._tokenStorageService.getPiUser() || {};

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

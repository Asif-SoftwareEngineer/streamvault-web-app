import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { VideoDataService } from 'src/app/services/videosData.service';
import { VideoPlayerComponent } from 'src/app/shared/video-player/video-player.component';

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
    private _dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('about to call  vidz list');

    this._videosList$ = this._videoDataService.getVideosByUserId(
      '2fb08ca8-5b69-4fe7-914e-0201da98e543'
    );
  }

  openVideoDialog($event: any) {
    const dialogRef = this._dialog.open(VideoPlayerComponent, {
      width: '95%',
      height: '95%',
      data: $event,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}

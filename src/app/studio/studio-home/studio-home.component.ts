import { Component, OnInit } from '@angular/core';

import { ChannelDataService } from 'src/app/services/channelData.service';
import { IChannel } from 'src/app/models/channel';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VideoDataService } from 'src/app/services/videosData.service';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Component({
  selector: 'app-studio-home',
  templateUrl: './studio-home.component.html',
  styleUrls: ['./studio-home.component.scss'],
})
export class StudioHomeComponent implements OnInit {
  public _channels$!: Observable<IChannel[]>;

  //public videos$!: Observable<any>;

  constructor(
    private _channelDataService: ChannelDataService,
    private _videoDataService: VideoDataService,
    private _tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    const userId: string = this._tokenStorage.getPiUser().uid;

    this._channels$ = this._channelDataService.getChannelsByUserId(userId);
    this._channels$.subscribe((data) => {
      console.log(data);
    });
  }

  getThumbnailUrl(thumbnail: string): string {
    return `${apiConfig.serverUrl}${thumbnail}`;
  }
}

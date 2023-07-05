import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/app/models/channel';
import { ChannelDataService } from 'src/app/services/channel-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-channel-info',
  templateUrl: './channel-info.component.html',
  styleUrls: ['./channel-info.component.scss'],
})
export class ChannelInfoComponent implements OnInit {
  protected channelId: string = '';
  protected channel!: Channel;
  protected serverUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelDataService
  ) {}

  ngOnInit() {
    this.serverUrl = environment.api.serverUrl;
    this.route.paramMap.subscribe((params) => {
      this.channelId = params.get('channelId')!;

      // PUll THE CHANNEL INFORMATION

      const userId = '648b46adfd79ae08df75fd8c';

      this.channelService.getChannel(userId, this.channelId).subscribe({
        next: (response) => {
          this.channel = response.channel as Channel;
          //console.log(this.channel);
          // Handle the successful response here
        },
        error: (errorMessage) => {
          console.log(errorMessage);
          // Handle the error message here
        },
      });
    });
  }
}

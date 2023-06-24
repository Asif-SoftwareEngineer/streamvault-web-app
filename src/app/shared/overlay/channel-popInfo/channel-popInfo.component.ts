import { Component, Input } from '@angular/core';

import { overLayType } from 'src/app/models/enums';

@Component({
  selector: 'app-channel-popInfo',
  templateUrl: './channel-popInfo.component.html',
  styleUrls: ['./channel-popInfo.component.scss'],
})
export class ChannelPopInfoComponent {
  protected OverlayType = overLayType;

  @Input() popupOverLayType: overLayType = overLayType.ChannelBanner;

  constructor() {
    this.popupOverLayType = overLayType.ChannelBanner;
  }
}

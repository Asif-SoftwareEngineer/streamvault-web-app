import { Component, Input } from '@angular/core';

import { OverLayType } from 'src/app/models/enums';

@Component({
  selector: 'app-channel-popInfo',
  templateUrl: './channel-popInfo.component.html',
  styleUrls: ['./channel-popInfo.component.scss'],
})
export class ChannelPopInfoComponent {
  protected overlayType = OverLayType;

  @Input() popupOverLayType: OverLayType = OverLayType.Banner;

  constructor() {
    this.popupOverLayType = OverLayType.Banner;
  }
}

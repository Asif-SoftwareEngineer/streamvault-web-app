import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-channel-popInfo',
  templateUrl: './channel-popInfo.component.html',
  styleUrls: ['./channel-popInfo.component.scss'],
})
export class ChannelPopInfoComponent {
  @Input() logoInfo: boolean = false;
  @Input() profileInfo: boolean = false;

  constructor() {}
}

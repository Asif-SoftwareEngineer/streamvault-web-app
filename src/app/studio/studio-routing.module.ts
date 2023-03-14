import { RouterModule, Routes } from '@angular/router';

import { ChannelComponent } from './channel/channel.component';
import { NgModule } from '@angular/core';
import { StudioHomeComponent } from './studio-home/studio-home.component';
import { VideoComponent } from './video/video.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: StudioHomeComponent },
  { path: 'channel', component: ChannelComponent },
  { path: 'video', component: VideoComponent },
  { path: 'player', component: VideoPlayerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudioRoutingModule {}

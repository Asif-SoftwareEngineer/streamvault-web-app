import { RouterModule, Routes } from '@angular/router';

import { ChannelComponent } from './channel/channel.component';
import { ChannelEditComponent } from './channel/channel-edit.component';
import { ChannelInfoComponent } from './channel/channel-info.component';
import { ChannelNewComponent } from './channel/channel-new.component';
import { NgModule } from '@angular/core';
import { StudioHomeComponent } from './studio-home/studio-home.component';
import { UploadComponent } from './video/upload/upload.component';
import { UploadDetailsComponent } from './video/upload-details/upload-details.component';
import { VideoEditComponent } from './video/video-edit/video-edit.component';
import { VideoInfoComponent } from './video/video-info/video-info.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: StudioHomeComponent },
  { path: 'new-channel', component: ChannelNewComponent },
  { path: 'edit-channel', component: ChannelEditComponent },
  { path: 'channel-info', component: ChannelInfoComponent },
  { path: 'channel', component: ChannelComponent },

  { path: 'upload-video', component: UploadComponent },
  { path: 'upload-vid-details', component: UploadDetailsComponent },
  { path: 'edit-video', component: VideoEditComponent },
  { path: 'video-info', component: VideoInfoComponent },
  { path: 'player', component: VideoPlayerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudioRoutingModule {}

import { ChannelComponent } from './channel/channel.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { StudioHomeComponent } from './studio-home/studio-home.component';
import { StudioRoutingModule } from './studio-routing.module';
import { VideoComponent } from './video/video.component';
import { ChannelEditComponent } from './channel/channel-edit.component';
import { ChannelNewComponent } from './channel/channel-new.component';
import { ChannelInfoComponent } from './channel/channel-info.component';
import { VideoNewComponent } from './video/video-new/video-new.component';
import { VideoEditComponent } from './video/video-edit/video-edit.component';
import { VideoInfoComponent } from './video/video-info/video-info.component';
import { VideoApprovalsComponent } from './video/video-approvals/video-approvals.component';

@NgModule({
  declarations: [
    ChannelComponent,
    StudioHomeComponent,
    VideoComponent,
    ChannelEditComponent,
    ChannelNewComponent,
    ChannelInfoComponent,
    VideoNewComponent,
    VideoEditComponent,
    VideoInfoComponent,
    VideoApprovalsComponent,
  ],
  imports: [
    CommonModule,
    StudioRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
  ],
})
export class StudioModule {}

import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification/notification-component';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoPlayerComponent } from '../studio/video-player/video-player.component';
import { ChannelPopInfoComponent } from './overlay/channel-popInfo/channel-popInfo.component';
import { ChannelbannerImageUploadComponent } from './overlay/channel-bannerImage-upload/channel-bannerImage-upload.component';

@NgModule({
  declarations: [
    NotificationComponent,
    FileUploadComponent,
    VideoPlayerComponent,
    ChannelPopInfoComponent,
    ChannelbannerImageUploadComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [
    NotificationComponent,
    FileUploadComponent,
    VideoPlayerComponent,
    ChannelbannerImageUploadComponent,
  ],
})
export class SharedModule {}

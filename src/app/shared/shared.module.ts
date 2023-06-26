import { ChannelImageUploadComponent } from './overlay/channel-bannerImage-upload/channel-Image-upload.component';
import { ChannelPopInfoComponent } from './overlay/channel-popInfo/channel-popInfo.component';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification/notification-component';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoPlayerComponent } from '../studio/video-player/video-player.component';

@NgModule({
  declarations: [
    NotificationComponent,
    FileUploadComponent,
    VideoPlayerComponent,
    ChannelPopInfoComponent,
    ChannelImageUploadComponent,
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
    ChannelImageUploadComponent,
  ],
})
export class SharedModule {}

import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification/notification-component';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoPlayerComponent } from '../studio/video-player/video-player.component';
import { ChannelLogoComponent } from './overlay/channel-logo/channel-logo.component';

@NgModule({
  declarations: [
    NotificationComponent,
    FileUploadComponent,
    VideoPlayerComponent,
    ChannelLogoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [NotificationComponent, FileUploadComponent, VideoPlayerComponent],
})
export class SharedModule {}

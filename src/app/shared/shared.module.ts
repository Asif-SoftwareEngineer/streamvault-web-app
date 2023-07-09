import { ChannelPopInfoComponent } from './overlay/channel-popInfo/channel-popInfo.component';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageUploadComponent } from './overlay/channel-Image-upload/Image-upload.component';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification/notification-component';
import { ReactiveFormsModule } from '@angular/forms';
import { TrimWhieSpaceDirective } from './directives/trim-white-space/trim-whie-space.directive';
import { VideoPlayerComponent } from '../studio/video-player/video-player.component';

@NgModule({
  declarations: [
    NotificationComponent,
    FileUploadComponent,
    VideoPlayerComponent,
    ChannelPopInfoComponent,
    ImageUploadComponent,
    TrimWhieSpaceDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [
    TrimWhieSpaceDirective,
    NotificationComponent,
    FileUploadComponent,
    VideoPlayerComponent,
    ImageUploadComponent,
  ],
})
export class SharedModule {}

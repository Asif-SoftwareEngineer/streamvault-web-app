import { ChannelPopInfoComponent } from './overlay/channel-popInfo/channel-popInfo.component';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './overlay/channel-Image-upload/Image-upload.component';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TrimWhieSpaceDirective } from './directives/trim-white-space/trim-whie-space.directive';
import { VideoPlayerComponent } from '../studio/video-player/video-player.component';

@NgModule({
  declarations: [
    VideoPlayerComponent,
    ChannelPopInfoComponent,
    ImageUploadComponent,
    TrimWhieSpaceDirective,
  ],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [TrimWhieSpaceDirective, VideoPlayerComponent, ImageUploadComponent],
})
export class SharedModule {}

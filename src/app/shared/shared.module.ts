import { ChannelPopInfoComponent } from './overlay/channel-popInfo/channel-popInfo.component';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './overlay/channel-Image-upload/Image-upload.component';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TrimWhieSpaceDirective } from './directives/trim-white-space/trim-whie-space.directive';

@NgModule({
  declarations: [
    ChannelPopInfoComponent,
    ImageUploadComponent,
    TrimWhieSpaceDirective,
  ],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [
    ChannelPopInfoComponent,
    TrimWhieSpaceDirective,
    ImageUploadComponent,
  ],
})
export class SharedModule {}

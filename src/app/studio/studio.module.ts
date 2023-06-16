import { ChannelComponent } from './channel/channel.component';
import { ChannelEditComponent } from './channel/channel-edit.component';
import { ChannelInfoComponent } from './channel/channel-info.component';
import { ChannelNewComponent } from './channel/channel-new.component';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from '../user-controls/field-error/field-error.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { StudioHomeComponent } from './studio-home/studio-home.component';
import { StudioRoutingModule } from './studio-routing.module';
import { UploadComponent } from './video/upload/upload.component';
import { UploadDetailsComponent } from './video/upload-details/upload-details.component';
import { VideoApprovalsComponent } from './video/video-approvals/video-approvals.component';
import { VideoEditComponent } from './video/video-edit/video-edit.component';
import { VideoInfoComponent } from './video/video-info/video-info.component';

@NgModule({
  declarations: [
    ChannelComponent,
    StudioHomeComponent,
    ChannelEditComponent,
    ChannelNewComponent,
    ChannelInfoComponent,
    VideoEditComponent,
    VideoInfoComponent,
    VideoApprovalsComponent,
    UploadDetailsComponent,
    UploadComponent,
  ],
  imports: [
    CommonModule,
    StudioRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    FieldErrorModule,
  ],
})
export class StudioModule {}

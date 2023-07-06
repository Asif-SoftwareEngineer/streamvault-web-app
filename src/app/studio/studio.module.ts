import { ChannelComponent } from './channel/channel.component';
import { ChannelEditComponent } from './channel/channel-edit.component';
import { ChannelInfoComponent } from './channel/channel-info.component';
import { ChannelNewComponent } from './channel/channel-new.component';
import { CommonModule } from '@angular/common';
import { FieldErrorModule } from '../shared/directives/field-error/field-error.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { PreUploadComponent } from './video/upload/pre-upload/pre-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SimpleDialogComponent } from '../common/simple-dialog.component';
import { StudioHomeComponent } from './studio-home/studio-home.component';
import { StudioRoutingModule } from './studio-routing.module';
import { UploadDetailsComponent } from './video/upload/upload-details/upload-details.component';
import { VideoApprovalsComponent } from './video/video-approvals/video-approvals.component';
import { VideoEditComponent } from './video/video-edit/video-edit.component';
import { VideoInfoComponent } from './video/video-info/video-info.component';
import { VideoListComponent } from './video/upload/video-list/video-list.component';

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
    PreUploadComponent,
    VideoListComponent,
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
  entryComponents: [SimpleDialogComponent],
})
export class StudioModule {}

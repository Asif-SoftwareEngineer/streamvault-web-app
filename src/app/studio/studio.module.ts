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

@NgModule({
  declarations: [ChannelComponent, StudioHomeComponent, VideoComponent],
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

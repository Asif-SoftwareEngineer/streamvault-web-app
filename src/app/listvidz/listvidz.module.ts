import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ListvidzRoutingModule } from './listvidz-routing.module';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VideoListComponent } from './list/video-list.component';

@NgModule({
  declarations: [VideoListComponent],
  imports: [
    CommonModule,
    ListvidzRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
  ],
})
export class ListvidzModule {}

import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { VideoListComponent } from './list/video-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: VideoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListvidzRoutingModule {}

import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SearchCriteriaComponent } from './search-criteria.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: 'define',
    component: SearchCriteriaComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}

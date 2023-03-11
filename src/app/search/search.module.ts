import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SearchCriteriaComponent } from './search-criteria.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  declarations: [SearchComponent, SearchCriteriaComponent],
  imports: [CommonModule, SearchRoutingModule],
})
export class SearchModule {}

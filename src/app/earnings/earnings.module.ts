import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EarningsRoutingModule } from './earnings-routing.module';
import { EarningsSummaryComponent } from './earnings-summary/earnings-summary.component';
import { EarningsViewsDetailsComponent } from './earnings-views-details/earnings-views-details.component';
import { EarningsValidationDetailsComponent } from './earnings-validation-details/earnings-validation-details.component';


@NgModule({
  declarations: [
    EarningsSummaryComponent,
    EarningsViewsDetailsComponent,
    EarningsValidationDetailsComponent
  ],
  imports: [
    CommonModule,
    EarningsRoutingModule
  ]
})
export class EarningsModule { }

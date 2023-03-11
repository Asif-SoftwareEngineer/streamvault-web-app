import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { PaymentMethodComponent } from './payment/payment-method.component';
import { SubscribeHomeComponent } from './subscribeHome.component';

const routes: Routes = [
  {
    path: '',
    component: SubscribeHomeComponent,
  },
  {
    path: 'payment',
    component: PaymentMethodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscrptionRoutingModule {}

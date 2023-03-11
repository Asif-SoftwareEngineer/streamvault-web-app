import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentMethodComponent } from './payment/payment-method.component';
import { SubscribeHomeComponent } from './subscribeHome.component';
import { SubscrptionRoutingModule } from './subscription-routing.module';

@NgModule({
  declarations: [PaymentMethodComponent, SubscribeHomeComponent],
  imports: [CommonModule, SubscrptionRoutingModule],
})
export class SubscrptionModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationRoutingModule } from './validation-routing.module';
import { RegisterComponent } from './register/register.component';
import { UnRegisterComponent } from './un-register/un-register.component';
import { ValidateVideoComponent } from './validate-video/validate-video.component';
import { VideoQueueComponent } from './video-queue/video-queue.component';
import { TermsAndRulesComponent } from './terms-and-rules/terms-and-rules.component';
import { ConfirmationRegisterComponent } from './confirmation-register/confirmation-register.component';
import { ConfirmationUnRegisterComponent } from './confirmation-un-register/confirmation-un-register.component';


@NgModule({
  declarations: [
    RegisterComponent,
    UnRegisterComponent,
    ValidateVideoComponent,
    VideoQueueComponent,
    TermsAndRulesComponent,
    ConfirmationRegisterComponent,
    ConfirmationUnRegisterComponent
  ],
  imports: [
    CommonModule,
    ValidationRoutingModule
  ]
})
export class ValidationModule { }

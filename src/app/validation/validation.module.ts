import { CommonModule } from '@angular/common';
import { ConfirmationRegisterComponent } from './confirmation-register/confirmation-register.component';
import { ConfirmationUnRegisterComponent } from './confirmation-un-register/confirmation-un-register.component';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { RulesComponent } from './terms-and-rules/rules.component';
import { UnRegisterComponent } from './un-register/un-register.component';
import { ValidateVideoComponent } from './validate-video/validate-video.component';
import { ValidationRoutingModule } from './validation-routing.module';
import { VideoQueueComponent } from './video-queue/video-queue.component';

@NgModule({
  declarations: [
    RegisterComponent,
    UnRegisterComponent,
    ValidateVideoComponent,
    VideoQueueComponent,
    RulesComponent,
    ConfirmationRegisterComponent,
    ConfirmationUnRegisterComponent,
  ],
  imports: [CommonModule, MaterialModule, ValidationRoutingModule],
})
export class ValidationModule {}
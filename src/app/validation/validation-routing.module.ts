import { RouterModule, Routes } from '@angular/router';

import { ConfirmationRegisterComponent } from './confirmation-register/confirmation-register.component';
import { ConfirmationUnRegisterComponent } from './confirmation-un-register/confirmation-un-register.component';
import { NgModule } from '@angular/core';
import { RegisterValidatorComponent } from './register/register-validator.component';
import { RulesComponent } from './validation-rules/rules.component';
import { UnRegisterValidatorComponent } from './un-register/un-register-validator.component';
import { ValidateVideoComponent } from './validate-video/validate-video.component';
import { VideoQueueComponent } from './video-queue/video-queue.component';

const routes: Routes = [
  { path: 'rules', component: RulesComponent },
  { path: 'validate-video', component: ValidateVideoComponent },
  { path: 'video-queue', component: VideoQueueComponent },
  { path: 'register-validator', component: RegisterValidatorComponent },
  { path: 'unregister-validator', component: UnRegisterValidatorComponent },
  {
    path: 'validator-reg-confirmation',
    component: ConfirmationRegisterComponent,
  },
  {
    path: 'validator-unreg-confirmation',
    component: ConfirmationUnRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationRoutingModule {}

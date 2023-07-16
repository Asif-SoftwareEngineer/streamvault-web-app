import { CaptureContactComponent } from './capture-contact/capture-contact.component';
import { CommonModule } from '@angular/common';
import { ContactVerificationComponent } from './contact-verification/contact-verification.component';
import { FieldErrorModule } from '../shared/directives/field-error/field-error.module';
import { LogOutComponent } from './log-out/log-out.component';
import { ManagementComponent } from './management/management.component';
import { MaterialModule } from '../material.module';
import { MemberHomeComponent } from './member-home/member-home.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';
import { MembershipOptionsComponent } from './membership-options/membership-options.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    LogOutComponent,
    MyProfileComponent,
    MemberRegistrationComponent,
    MemberHomeComponent,
    UserHomeComponent,
    ManagementComponent,
    ContactVerificationComponent,
    MembershipOptionsComponent,
    CaptureContactComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FieldErrorModule,
  ],
})
export class UserModule {}

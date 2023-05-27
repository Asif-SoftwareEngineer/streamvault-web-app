import { CommonModule } from '@angular/common';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { FieldErrorModule } from '../user-controls/field-error/field-error.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LogOutComponent } from './log-out/log-out.component';
import { ManagementComponent } from './management/management.component';
import { MaterialModule } from '../material.module';
import { MemberHomeComponent } from './member-home/member-home.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';
import { MembershipOptionsComponent } from './membership-options/membership-options.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NameInputComponent } from './name-input/name-input.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    LogOutComponent,
    RegisterComponent,
    MyProfileComponent,
    MemberRegistrationComponent,
    MemberHomeComponent,
    UserHomeComponent,
    ManagementComponent,
    EmailVerificationComponent,
    MembershipOptionsComponent,
    NameInputComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    UserRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FieldErrorModule,
  ],
})
export class UserModule {}

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LogOutComponent } from './log-out/log-out.component';
import { LoginComponent } from '../login/login.component';
import { MaterialModule } from '../material.module';
import { MemberComponent } from './member/member.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';
import { MemberHomeComponent } from './member-home/member-home.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { ManagementComponent } from './management/management.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { MembershipOptionsComponent } from './membership-options/membership-options.component';

@NgModule({
  declarations: [
    LoginComponent,
    LogOutComponent,
    RegisterComponent,
    MemberComponent,
    MyProfileComponent,
    MemberRegistrationComponent,
    MemberHomeComponent,
    UserHomeComponent,
    ManagementComponent,
    EmailVerificationComponent,
    MembershipOptionsComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    UserRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}

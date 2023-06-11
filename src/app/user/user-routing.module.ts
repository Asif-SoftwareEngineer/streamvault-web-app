import { RouterModule, Routes } from '@angular/router';

import { ContactVerificationComponent } from './contact-verification/contact-verification.component';
import { LogOutComponent } from './log-out/log-out.component';
import { MemberHomeComponent } from './member-home/member-home.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';
import { MembershipOptionsComponent } from './membership-options/membership-options.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { UserHomeComponent } from './user-home/user-home.component';

const routes: Routes = [
  { path: 'register-member', component: MemberRegistrationComponent },
  { path: 'member-home', component: MemberHomeComponent },

  { path: 'user-home', component: UserHomeComponent },
  { path: 'registerOld', component: RegisterComponent },

  // { path: 'verification-email', component: ContactVerificationComponent },
  // { path: 'membership-options', component: MembershipOptionsComponent },

  { path: 'profile', component: MyProfileComponent },
  { path: 'logout', component: LogOutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudioRoutingModule {}

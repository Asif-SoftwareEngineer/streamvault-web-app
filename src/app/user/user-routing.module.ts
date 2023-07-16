import { RouterModule, Routes } from '@angular/router';

import { LogOutComponent } from './log-out/log-out.component';
import { MemberHomeComponent } from './member-home/member-home.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NgModule } from '@angular/core';
import { UserHomeComponent } from './user-home/user-home.component';

const routes: Routes = [
  { path: 'register-member', component: MemberRegistrationComponent },
  { path: 'member-home', component: MemberHomeComponent },

  { path: 'user-home', component: UserHomeComponent },

  // { path: 'verification-email', component: ContactVerificationComponent },
  // { path: 'membership-options', component: MembershipOptionsComponent },

  { path: 'profile/:userId', component: MyProfileComponent },
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

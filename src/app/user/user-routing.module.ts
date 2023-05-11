import { RouterModule, Routes } from '@angular/router';

import { LogOutComponent } from './log-out/log-out.component';
import { LoginComponent } from '../login/login.component';
import { MemberHomeComponent } from './member-home/member-home.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { UserHomeComponent } from './user-home/user-home.component';

const routes: Routes = [
  { path: 'memberHome', component: MemberHomeComponent },
  { path: 'userHome', component: UserHomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'member', component: MemberRegistrationComponent },
  { path: 'profile', component: MyProfileComponent },
  { path: 'login', component: LoginComponent },
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

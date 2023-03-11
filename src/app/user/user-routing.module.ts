import { RouterModule, Routes } from '@angular/router';

import { LogOutComponent } from './log-out/log-out.component';
import { LoginComponent } from '../login/login.component';
import { MemberComponent } from './member/member.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'member', component: MemberComponent },
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

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

@NgModule({
  declarations: [
    LoginComponent,
    LogOutComponent,
    RegisterComponent,
    MemberComponent,
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

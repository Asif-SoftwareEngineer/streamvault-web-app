import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModalDialogComponent } from './login/auth-modal-dialog/auth-modal-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { StudioModule } from './studio/studio.module';
import { UserModule } from './user/user.module';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthModalDialogComponent,
    PageNotFoundComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    UserModule,
    StudioModule,
    SharedModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
function provide(arg0: string, arg1: { useValue: string; }): import("@angular/core").Provider {
  throw new Error('Function not implemented.');
}


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { EarningsModule } from './earnings/earnings.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { SimpleDialogComponent } from './common/simple-dialog.component';
import { StudioModule } from './studio/studio.module';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { UserModule } from './user/user.module';
import { ValidationModule } from './validation/validation.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    PrivacyPolicyComponent,
    TermsOfServiceComponent,
    SimpleDialogComponent,
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
    EarningsModule,
    ValidationModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
function provide(
  arg0: string,
  arg1: { useValue: string }
): import('@angular/core').Provider {
  throw new Error('Function not implemented.');
}

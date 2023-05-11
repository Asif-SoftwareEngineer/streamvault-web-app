import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:redirectUrl', component: LoginComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'tos', component: TermsOfServiceComponent },

  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
    //canLoad: [AuthGuard],
  },
  {
    path: 'list',
    loadChildren: () =>
      import('./listvidz/listvidz.module').then((m) => m.ListvidzModule),
    //canLoad: [AuthGuard],
  },
  {
    path: 'studio',
    loadChildren: () =>
      import('./studio/studio.module').then((m) => m.StudioModule),
    //canLoad: [AuthGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    //canLoad: [AuthGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

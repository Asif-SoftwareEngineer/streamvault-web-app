import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyPolicyComponentPage } from './privacy-policy/privacy-policy.componentPage';
import { TermsOfServiceComponentPage } from './terms-of-service/terms-of-service.componentPage';

//import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'home', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: HomeComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponentPage },
  { path: 'tos', component: TermsOfServiceComponentPage },

  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
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
  {
    path: 'validation',
    loadChildren: () =>
      import('./validation/validation.module').then((m) => m.ValidationModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

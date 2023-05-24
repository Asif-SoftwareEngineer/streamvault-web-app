import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { RulesComponent } from './terms-and-rules/rules.component';

const routes: Routes = [{ path: 'rules', component: RulesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationRoutingModule {}

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';

const modules = [
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatTooltipModule,
  MatSidenavModule,
  MatDialogModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatListModule,
  MatCardModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatBadgeModule,
  MatExpansionModule,
  MatStepperModule,
  MatAutocompleteModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatChipsModule,
];

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules,
})
export class MaterialModule {}

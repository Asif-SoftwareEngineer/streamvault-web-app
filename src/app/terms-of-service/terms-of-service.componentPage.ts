import { Component, OnInit } from '@angular/core';

import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-terms-of-service-page',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss'],
})
export class TermsOfServiceComponentPage {
  showCloseButton: boolean = false;

  constructor() {}

  closeDialog(): void {
    return;
  }
}

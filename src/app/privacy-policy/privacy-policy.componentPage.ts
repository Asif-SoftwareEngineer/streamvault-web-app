import { Component, OnInit } from '@angular/core';

import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponentPage {
  showCloseButton: boolean = false;

  constructor() {}

  closeDialog(): void {
    return;
  }
}

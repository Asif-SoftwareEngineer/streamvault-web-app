import { Component, OnInit } from '@angular/core';

import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent {
  showCloseButton: boolean = true;
  constructor(private dialogRef: MatDialogRef<PrivacyPolicyComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}

import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss'],
})
export class TermsOfServiceComponent {
  constructor(private dialogRef: MatDialogRef<TermsOfServiceComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();

    console.log('dialog was closed');
  }
}

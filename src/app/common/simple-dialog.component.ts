import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  // prettier-ignore
  template: `
    <span class="heading-5" mat-dialog-title>{{ data.title }}</span>
    <mat-dialog-content>
      <p class="Content-2" style="text-align:justify">{{ data.content }}</p>
      <p *ngIf="data.content2" class="Content-2" style="text-align:justify">{{ data.content2 }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <div style="display:flex; flex-direction: row; width:100%; justify-content:flex-end">
      <button mat-button mat-dialog-close class="button-text-2" style="background-color:var(--dl-color-primary-300);width:var(--dl-size-size-medium); height:var(--dl-size-size-xsmall)" *ngIf="data.cancelText">
        {{ data.cancelText }}
      </button>
      <button mat-button mat-button-raised class="button-text-2" [mat-dialog-close]="true" style="background-color:var(--dl-color-primary-900);width:var(--dl-size-size-medium); height:var(--dl-size-size-xsmall)"
        cdkFocusInitial>
        {{ data.okText }}
      </button>
      </div>
    </mat-dialog-actions>
  `,
})
export class SimpleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SimpleDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}

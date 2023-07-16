import { BehaviorSubject, Observable } from 'rxjs';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarConfig as MatSnackBarConfig } from '@angular/material/legacy-snack-bar';

import { Injectable } from '@angular/core';
import { SimpleDialogComponent } from './simple-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  navigationButtonSelected: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  showToast(
    message: string,
    displayTime = 2500,
    action = 'Close',
    config?: MatSnackBarConfig
  ) {
    this.snackBar.open(
      message,
      action,
      config || {
        duration: displayTime, // Duration in milliseconds
        horizontalPosition: 'center', // Snackbar's horizontal position
        verticalPosition: 'bottom', // Snackbar's vertical position
        panelClass: ['error-snackbar'],
      }
    );
  }

  showDialog(
    title: string,
    content: string,
    content2: string,
    okText = 'OK',
    cancelText?: string,
    customConfig?: MatDialogConfig
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(
      SimpleDialogComponent,
      customConfig || {
        width: '400px',
        data: { title, content, content2, okText, cancelText },
      }
    );

    return dialogRef.afterClosed();
  }
}

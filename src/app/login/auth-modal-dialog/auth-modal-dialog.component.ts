import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogAuthData } from './IDialogAuthData';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-auth-modal-dialog',
  templateUrl: './auth-modal-dialog.component.html',
  styleUrls: ['./auth-modal-dialog.component.scss'],
})
export class AuthModalDialogComponent implements OnInit {
  protected _title: string;
  protected _keyMessage: string;
  protected _pointsMessage: string[];

  constructor(
    public dialogRef: MatDialogRef<AuthModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogAuthData
  ) {
    this._title = data.title;
    this._keyMessage = data.keyMessage;
    this._pointsMessage = data.messagePoints;
  }

  ngOnInit(): void {
    return;
  }

  declineAuth(): void {
    this.dialogRef.close();
  }
}

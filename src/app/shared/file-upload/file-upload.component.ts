import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  protected _uploadForm: FormGroup = this._fb.group({});

  private _selectedFile: File | null = null;
  protected _fileName = '';
  protected _uploadProgress: number = 0;

  constructor(
    private _fb: FormBuilder,
    private _http: HttpClient,
    private _uploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this._uploadForm = this._fb.group({
      fileControl: ['', [Validators.required]],
    });
  }

  protected onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    this._selectedFile = <File>target?.files?.[0] ?? undefined;
    if (this._selectedFile) {
      this._fileName = this._selectedFile.name;
      this._uploadForm.controls['fileControl'].setValue(this._fileName);
    }
  }

  // public uploadVideo(
  //   userId: string,
  //   channelId: string
  // ): Observable<{ progress: number; fileHandle: string }> {
  //   return new Observable((observer) => {
  //     this._uploadProgress = 0;
  //     let strFileHandle = '';

  //     if (this._selectedFile) {
  //       this._fileName = this._selectedFile.name;

  //       this._uploadService
  //         .uploadVideo(this._selectedFile, userId, channelId, 'adfdsf')
  //         .subscribe({
  //           next: (event: any) => {
  //             if (event.type === HttpEventType.UploadProgress) {
  //               this._uploadProgress = Math.round(
  //                 (100 * event.loaded) / event.total
  //               );
  //               observer.next({
  //                 progress: this._uploadProgress,
  //                 fileHandle: '',
  //               });
  //             } else if (event instanceof HttpResponse) {
  //               strFileHandle = event.body?.fileHandle.toString();
  //               observer.next({ progress: 100, fileHandle: strFileHandle });
  //               observer.complete();
  //             }
  //           },
  //           error: (err: any) => {
  //             this._uploadProgress = 0;
  //             observer.error(err);
  //           },
  //         });
  //     } else {
  //       observer.error('No file selected');
  //     }
  //   });
  // }

  clearFile() {
    this._fileName = '';
    this._uploadForm.controls['fileControl'].setValue('');
  }
}

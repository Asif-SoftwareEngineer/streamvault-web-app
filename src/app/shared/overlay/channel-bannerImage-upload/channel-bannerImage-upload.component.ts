import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-channel-bannerImage-upload',
  templateUrl: './channel-bannerImage-upload.component.html',
  styleUrls: ['./channel-bannerImage-upload.component.scss'],
})
export class ChannelbannerImageUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() imageUrlEmitter: EventEmitter<string> = new EventEmitter<string>();

  // Function to emit the imageUrl
  emitUploadedImageUrl(imageUrl: string) {
    this.imageUrlEmitter.emit(imageUrl);
  }

  private uploadSubscription: Subscription | undefined;
  selectedFile: any;
  imageFileName: string = '';
  uploadProgress: number = 0;
  imageUrl: string = '';
  isUploading: boolean = false;

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width > 970 && img.height > 250) {
            this.selectedFile = e.target.result;
            this.uploadBannerImage(file);
            // Image dimensions are correct
          } else {
            // Image dimensions are incorrect
            alert(
              'Please select an image with dimensions of 970 x 250 pixels.'
            );
            this.resetFileInput();
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  chooseImageFile() {
    this.fileInput.nativeElement.click();
  }

  uploadBannerImage(imageFile: File) {
    if (!this.selectedFile) return;

    if (this.selectedFile) {
      this.uploadProgress = 0;
      this.imageUrl = '';
      this.isUploading = true;

      this.uploadSubscription = this.fileUploadService
        .uploadBannerImage(imageFile, 'hayaasif')
        .subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round(
                (100 * event.loaded) / event.total
              );
            } else if (event instanceof HttpResponse) {
              this.uploadProgress = 100;
              setTimeout(() => {
                this.isUploading = false;
              }, 1500);
              console.log(JSON.stringify(event.body));
              const imageUrl = event.body?.imageUrl.toString();
              this.imageUrlEmitter.emit(imageUrl);
            }
          },
          error: (error: any) => {
            this.uploadProgress = 0;
            this.isUploading = false;
            // Handle the error
          },
        });
    } else {
      this.isUploading = false;
      // Handle the case when no file is selected
    }
  }

  ngOnInit(): void {
    this.uploadProgress = 0;
  }

  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
    this.imageFileName = '';
  }
}

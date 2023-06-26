import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { ImageType } from 'src/app/models/enums';

@Component({
  selector: 'app-channel-Image-upload',
  templateUrl: './channel-Image-upload.component.html',
  styleUrls: ['./channel-Image-upload.component.scss'],
})
export class ChannelImageUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  protected imageType = ImageType;
  @Input() targetImageType: ImageType = ImageType.Banner;
  @Output() composedBannerImageUrl: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() composedProfileImageUrl: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() closeOverlay: EventEmitter<void> = new EventEmitter<void>();

  private uploadSubscription: Subscription | undefined;
  protected selectedFile: any;
  protected imageFileName: string = '';
  protected uploadProgress: number = 0;
  protected imageUrl: string = '';
  protected isUploading: boolean = false;

  constructor(private fileUploadService: FileUploadService) {}

  protected onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (this.targetImageType === ImageType.Banner) {
            if (
              img.width >= 970 &&
              img.width <= 1600 &&
              img.height >= 250 &&
              img.height <= 400
            ) {
              this.selectedFile = e.target.result;
              this.uploadBannerImage(file);
              // Image dimensions are correct
            } else {
              // Image dimensions are incorrect
              alert(
                'Please select an image with dimensions between 970x250px and 1600x400px.'
              );
              this.resetFileInput();
            }
          } else if (this.targetImageType === ImageType.Profile) {
            if (
              img.width >= 200 &&
              img.width <= 400 &&
              img.height >= 200 &&
              img.height <= 400
            ) {
              this.selectedFile = e.target.result;
              this.uploadBannerImage(file);
              // Image dimensions are correct
            } else {
              // Image dimensions are incorrect
              alert(
                'Please select an image with dimensions between 200x200px and 400x400px.'
              );
              this.resetFileInput();
            }
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  protected chooseImageFile() {
    this.fileInput.nativeElement.click();
  }

  private uploadBannerImage(imageFile: File) {
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
              if (this.targetImageType === ImageType.Banner) {
                this.composedBannerImageUrl.emit(imageUrl);
              } else if (this.targetImageType === ImageType.Profile) {
                this.composedProfileImageUrl.emit(imageUrl);
              }
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

  protected closeBannerUploadOverlay() {
    this.closeOverlay.emit();
  }

  private resetFileInput() {
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
    this.imageFileName = '';
  }
}
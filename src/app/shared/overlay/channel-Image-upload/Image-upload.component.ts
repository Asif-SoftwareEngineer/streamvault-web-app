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
import { UploadImageUrlType } from 'src/app/models/upload';

@Component({
  selector: 'app-Image-upload',
  templateUrl: './Image-upload.component.html',
  styleUrls: ['./Image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  protected imageType = ImageType;
  @Input() targetImageType: ImageType = ImageType.Banner;
  @Input() fileNameIdentifier: string = '';
  @Output() imageUrl: EventEmitter<UploadImageUrlType> =
    new EventEmitter<UploadImageUrlType>();

  @Output() closeOverlay: EventEmitter<void> = new EventEmitter<void>();

  private uploadSubscription: Subscription | undefined;
  protected selectedFile: any;
  protected imageFileName: string = '';
  protected uploadProgress: number = 0;
  protected strImageUrl: string = '';
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
          if (this.validateImageType(img) === true) {
            this.selectedFile = e.target.result;
            this.uploadImage(
              file,
              this.targetImageType,
              this.fileNameIdentifier
            );
          }
        };
        // The img.src assignment should be here
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  validateImageType(img: HTMLImageElement): boolean {
    if (this.targetImageType === ImageType.Banner) {
      if (
        img.width >= 450 &&
        img.width <= 1600 &&
        img.height >= 250 &&
        img.height <= 1250
      ) {
        return true;
      } else {
        alert(
          'Please select an image with dimensions between 450x250px and 1600x1250px.'
        );
      }
    } else if (this.targetImageType === ImageType.Profile) {
      if (
        img.width >= 200 &&
        img.width <= 400 &&
        img.height >= 200 &&
        img.height <= 400
      ) {
        return true;
      } else {
        alert(
          'Please select an image with dimensions between 200x200px and 400x400px.'
        );
      }
    } else if (this.targetImageType === ImageType.Thumbnail) {
      if (
        img.width >= 970 &&
        img.width <= 5000 &&
        img.height >= 700 &&
        img.height <= 3750
      ) {
        return true;
      } else {
        alert(
          'Please select an image with dimensions between 970x250px and 1600x1250px.'
        );
      }
    }
    this.resetFileInput();
    return false;
  }

  protected chooseImageFile() {
    this.fileInput.nativeElement.click();
  }

  private uploadImage(imageFile: File, imageType: ImageType, fileName: string) {
    if (!this.selectedFile) return;

    if (this.selectedFile) {
      this.uploadProgress = 0;
      this.strImageUrl = '';
      this.isUploading = true;

      this.uploadSubscription = this.fileUploadService
        .uploadImage(imageFile, imageType, fileName)
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
                const imageUrl = event.body?.imageUrl.toString();
                const uploadImageUrlTypeObj: UploadImageUrlType = {
                  imageUrl: imageUrl,
                  imageType: this.targetImageType,
                };
                this.imageUrl.emit(uploadImageUrlTypeObj);

                // if (this.targetImageType === ImageType.Banner) {
                // } else if (this.targetImageType === ImageType.Profile) {
                // }
              }, 1500);
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
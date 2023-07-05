import { BehaviorSubject, Observable } from 'rxjs';
import { ImageType, OverLayType } from '../models/enums';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

import { ChannelImageUploadComponent } from '../shared/overlay/channel-Image-upload/channel-Image-upload.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { UploadImageUrlType } from '../models/upload';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  protected imageType = ImageType;
  protected overlayType = OverLayType;
  protected thumbnailImageUrl: string =
    'channel/banner/hayaasif-file-1687696435583.JPG';
  private overlayRef!: OverlayRef;
  private imageUrlSubject: BehaviorSubject<UploadImageUrlType | null> =
    new BehaviorSubject<UploadImageUrlType | null>(null);

  // Getter for the imageUrl subject
  get imageUrl$(): Observable<UploadImageUrlType | null> {
    return this.imageUrlSubject.asObservable();
  }

  // Method to update the imageUrl value
  updateImageUrl(imageUrlType: UploadImageUrlType): void {
    this.imageUrlSubject.next(imageUrlType);
  }

  constructor(private overlay: Overlay) {}

  showImageUploadOverlay(event: MouseEvent, strImageType: string): void {
    const validImageTypes = [
      ImageType.Banner,
      ImageType.Thumbnail,
      ImageType.Profile,
    ];

    // Create an overlay config with the anchor element
    const overlayConfig = this.getOverlayConfigForImageUpload(strImageType);

    // Create an overlay reference
    this.overlayRef = this.overlay.create(overlayConfig);

    // Create a portal and attach it to the overlay
    const overlayPortal = new ComponentPortal(ChannelImageUploadComponent);

    const imageUploadOverlayInstance =
      this.overlayRef.attach(overlayPortal).instance; // Attach the portal to the overlay

    if (validImageTypes.includes(strImageType as ImageType)) {
      // Perform your logic here
      imageUploadOverlayInstance.targetImageType = strImageType as ImageType;
    } else {
      console.log('Invalid Image type provided.');
      return;
    }

    // Access the event emitter of the child component
    imageUploadOverlayInstance.imageUrl.subscribe(
      (uploadImageUrlType: UploadImageUrlType) => {
        this.updateImageUrl(uploadImageUrlType);
      }
    );

    // Subscribe to the closeOverlay event emitted from the InfoPopupComponent
    imageUploadOverlayInstance.closeOverlay.subscribe(() => {
      this.closePopup();
    });

    //Close the overlay when the backdrop is clicked
    this.overlayRef.backdropClick().subscribe(() => {
      this.closePopup();
    });
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  private getOverlayConfigForImageUpload(imageType: string): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      minWidth: '90vw',
      hasBackdrop: true,
      backdropClass: 'popup-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    return overlayConfig;
  }
}

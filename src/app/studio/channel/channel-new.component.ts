import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { map, startWith } from 'rxjs/operators';

import { ChannelPopInfoComponent } from 'src/app/shared/overlay/channel-popInfo/channel-popInfo.component';
import { ChannelbannerImageUploadComponent } from 'src/app/shared/overlay/channel-bannerImage-upload/channel-bannerImage-upload.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { ErrorSets } from 'src/app/user-controls/field-error/field-error.directive';
import { FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { RequiredTextValidation } from 'src/app/common/validations';
import { environment } from 'src/environments/environment';
import { overLayType } from 'src/app/models/enums';

@Component({
  selector: 'app-channel-new',
  templateUrl: './channel-new.component.html',
  styleUrls: ['./channel-new.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelNewComponent implements OnInit {
  newChannelFormGroup!: FormGroup;
  ErrorSets = ErrorSets;
  isCreating = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl('');
  filteredCategories: Observable<string[]>;
  categories: string[] = [];

  bannerImageUrl: string = '';

  allCategoriesOriginal: string[] = [
    'Science and Technology',
    'Education and Learning',
    'Comedy and Entertainment',
    'Music and Dance',
    'Travel and Adventure',
    'Gaming and Esports',
    'Health and Fitness',
    'Food and Cooking',
    'Fashion and Beauty',
    'Sports and Fitness',
    'Art and Creativity',
    'News and Politics',
    'Lifestyle and Vlogs',
    'Business and Finance',
    'Nature and Wildlife',
    'DIY and Crafts',
    'Parenting and Family',
    'Film and Cinema',
    'History and Archaeology',
    'Photography and Videography',
    'Home and Interior Design',
    'Technology Reviews',
    'Motivation and Inspiration',
    'Animal and Pet Videos',
    'Cars and Automotive',
    'Spirituality and Meditation',
    'Animation and Cartoons',
    'Documentaries',
    'Language Learning',
    'Book Reviews',
    'Social Causes and Activism',
  ];

  allCategories: string[] = [];

  ngOnInit(): void {
    this.allCategories = this.allCategoriesOriginal
      .slice()
      .sort((a, b) => a.localeCompare(b));

    this.newChannelFormGroup = this.fb.group({
      channelNameCtrl: ['', RequiredTextValidation],
      handleCtrl: [''],
      categoryCtrl: '',
      descriptionCtrl: '',
    });
  }

  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  private overlayRef!: OverlayRef;

  constructor(private fb: FormBuilder, private overlay: Overlay) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) =>
        category ? this._filter(category) : this.allCategories.slice()
      )
    );
  }

  showInfoPopup(event: MouseEvent, popupType: string): void {
    const anchorElement = event.target as HTMLElement;

    // Create an overlay config with the anchor element
    const overlayConfig = this.getOverlayConfigForPopups(
      anchorElement,
      popupType
    );

    // Create an overlay reference
    this.overlayRef = this.overlay.create(overlayConfig);

    // Create a portal and attach it to the overlay
    const infoPopupPortal = new ComponentPortal(ChannelPopInfoComponent);
    const overlayComponentRef = this.overlayRef.attach(infoPopupPortal);

    if (popupType === overLayType.ChannelBanner) {
      overlayComponentRef.instance.popupOverLayType = overLayType.ChannelBanner;
    } else if (popupType === overLayType.ChannelProfile) {
      overlayComponentRef.instance.popupOverLayType =
        overLayType.ChannelProfile;
    }

    //Close the overlay when the backdrop is clicked
    this.overlayRef.backdropClick().subscribe(() => {
      this.closePopup();
    });
  }

  showBannerImageUploadOverlay(event: MouseEvent, popupType: string): void {
    //const anchorElement = event.target as HTMLElement;

    // Create an overlay config with the anchor element
    const overlayConfig = this.getOverlayConfigForBannerUpload();

    // Create an overlay reference
    this.overlayRef = this.overlay.create(overlayConfig);

    // Create a portal and attach it to the overlay

    const overlayPortal = new ComponentPortal(
      ChannelbannerImageUploadComponent
    );
    //overlayRef.attach(overlayPortal);

    //bannerUploadOverlayComp: ComponentRef<ChannelbannerImageUploadComponent>;

    const bannerUploadOverlayCompInstance =
      this.overlayRef.attach(overlayPortal).instance; // Attach the portal to the overlay

    // Access the event emitter of the child component
    bannerUploadOverlayCompInstance.imageUrlEmitter.subscribe(
      (imageUrl: string) => {
        this.handleImageUrl(imageUrl);
      }
    );

    bannerUploadOverlayCompInstance.imageUrlEmitter.subscribe(() => {});

    // Subscribe to the closeOverlay event emitted from the InfoPopupComponent
    bannerUploadOverlayCompInstance.closeOverlay.subscribe(() => {
      this.closePopup();
    });

    //Close the overlay when the backdrop is clicked
    this.overlayRef.backdropClick().subscribe(() => {
      this.closePopup();
    });
  }

  // Function to handle the emitted imageUrl from the child component
  handleImageUrl(imageUrl: string) {
    const apiConfig = environment.api;
    this.bannerImageUrl = `${apiConfig.serverUrl}${imageUrl}`;
  }

  closePopup(): void {
    if (this.overlayRef) {
      console.log('close triggered');
      this.overlayRef.dispose();
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our category

    if (value) {
      this.categories.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.categoryCtrl.setValue(null);
  }

  remove(category: string): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push(event.option.viewValue);

    const indexToRemove: number = this.allCategories.indexOf(
      event.option.viewValue
    );

    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(filterValue);
    return this.allCategoriesOriginal.filter((category) =>
      category.toLowerCase().includes(filterValue)
    );
  }

  private getOverlayConfigForBannerUpload(): OverlayConfig {
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

  private getOverlayConfigForPopups(
    anchorElement: HTMLElement,
    popType: string
  ): OverlayConfig {
    let positionStrategy: any;
    if (popType === overLayType.ChannelBanner) {
      positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(anchorElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
            //offsetX: -170, // Adjust the offset as per your needs
            //offsetY: 200,
          },
        ]);
    } else if (popType === overLayType.ChannelProfile) {
      positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(anchorElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetX: 30, // Adjust the offset as per your needs
            //offsetY: 200,
          },
        ]);
    }

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'popup-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    return overlayConfig;
  }
}

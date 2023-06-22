import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
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

  constructor(private fb: FormBuilder, private overlay: Overlay) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) =>
        category ? this._filter(category) : this.allCategories.slice()
      )
    );
  }

  showInfoPopup(event: MouseEvent, popType: string): void {
    const anchorElement = event.target as HTMLElement;

    // Create an overlay config with the anchor element
    const overlayConfig = this.getOverlayConfigForPopups(
      anchorElement,
      popType
    );

    // Create an overlay reference
    const overlayRef = this.overlay.create(overlayConfig);

    // Create a portal and attach it to the overlay
    const infoPopupPortal = new ComponentPortal(ChannelPopInfoComponent);
    const overlayComponentRef = overlayRef.attach(infoPopupPortal);

    if (popType === 'banner') {
      overlayComponentRef.instance.logoInfo = true;
    } else if (popType === 'thumb') {
      overlayComponentRef.instance.thumbInfo = true;
    } else {
      overlayComponentRef.instance.thumbInfo = false;
      overlayComponentRef.instance.thumbInfo = false;
    }

    //Close the overlay when the backdrop is clicked
    overlayRef.backdropClick().subscribe(() => {
      overlayRef.dispose();
    });
  }

  showBannerImageUploadOverlay(event: MouseEvent, popType: string): void {
    //const anchorElement = event.target as HTMLElement;

    // Create an overlay config with the anchor element
    const overlayConfig = this.getOverlayConfigForBannerUpload();

    // Create an overlay reference
    const overlayRef = this.overlay.create(overlayConfig);

    // Create a portal and attach it to the overlay

    const overlayPortal = new ComponentPortal(
      ChannelbannerImageUploadComponent
    );
    overlayRef.attach(overlayPortal);

    //Close the overlay when the backdrop is clicked
    overlayRef.backdropClick().subscribe(() => {
      overlayRef.dispose();
    });
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

    // Item removed - needs to be added back for subsequent selection
    // const indexToRemove: number = this.allCategoriesOriginal.indexOf(category);
    // if (indexToRemove !== -1) {
    //   console.log(category);
    //   this.allCategories.push(category);
    //   this.allCategories = this.allCategories
    //     .slice()
    //     .sort((a, b) => a.localeCompare(b));

    //   this.filteredCategories = of(this.allCategories);
    // }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push(event.option.viewValue);

    const indexToRemove: number = this.allCategories.indexOf(
      event.option.viewValue
    );

    // filtered Categories - observing the changes within all Categories array.
    // if (indexToRemove !== -1) {
    //   this.allCategories.splice(indexToRemove, 1);
    //   this.allCategories = this.allCategories
    //     .slice()
    //     .sort((a, b) => a.localeCompare(b));

    //   this.filteredCategories = of(this.allCategories);
    // }

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

  // let positionStrategy: any;

  // positionStrategy = this.overlay
  //   .position()
  //   .flexibleConnectedTo(anchorElement)
  //   .withPositions([
  //     {
  //       originX: 'center',
  //       originY: 'top',
  //       overlayX: 'center',
  //       overlayY: 'center',
  //       //offsetX: -170, // Adjust the offset as per your needs
  //       //offsetY: 10,
  //     },
  //   ]);

  // const overlayConfig = new OverlayConfig({
  //   positionStrategy,
  //   minWidth: '90vw', // Adjust the width as per your needs
  //   maxWidth: '100vw',
  //   minHeight: '40vw',
  //   maxHeight: '50vw',
  //   hasBackdrop: true,
  //   backdropClass: 'popup-backdrop',
  //   scrollStrategy: this.overlay.scrollStrategies.block(),
  // });

  private getOverlayConfigForPopups(
    anchorElement: HTMLElement,
    popType: string
  ): OverlayConfig {
    let positionStrategy: any;
    if (popType === 'banner') {
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
    } else if (popType === 'thumb') {
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

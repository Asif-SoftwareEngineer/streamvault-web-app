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
import { ImageType, OverLayType } from 'src/app/models/enums';
import { Observable, of } from 'rxjs';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { map, startWith } from 'rxjs/operators';

import { ChannelDataService } from 'src/app/services/channel-data.service';
import { ChannelImageUploadComponent } from 'src/app/shared/overlay/channel-Image-upload/channel-Image-upload.component';
import { ChannelPopInfoComponent } from 'src/app/shared/overlay/channel-popInfo/channel-popInfo.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { ErrorSets } from 'src/app/shared/directives/field-error/field-error.directive';
import { FormGroup } from '@angular/forms';
import { IChannel } from 'src/app/models/channel';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { RequiredTextValidation } from 'src/app/common/validations';
import { Router } from '@angular/router';
import { UiService } from 'src/app/common/ui.service';
import { environment } from 'src/environments/environment';
import { ImageUploadService } from 'src/app/services/image-upload-service';
import { IUploadImageUrlType } from 'src/app/models/upload';

@Component({
  selector: 'app-channel-new',
  templateUrl: './channel-new.component.html',
  styleUrls: ['./channel-new.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelNewComponent implements OnInit {
  //#region Declaration

  protected imageType = ImageType;
  protected overlayType = OverLayType;

  protected newChannelFormGroup!: FormGroup;
  protected ErrorSets = ErrorSets;

  protected isCreating = false;

  protected separatorKeysCodes: number[] = [ENTER, COMMA];
  protected filteredCategories: Observable<string[]> | undefined;
  protected categories: string[] = [];

  protected serverUrl: string = '';
  protected bannerImageUrl: string = '';
  protected profileImageUrl: string = '';

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
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  private overlayRef!: OverlayRef;
  protected imageUrlType: IUploadImageUrlType | null = null;

  //#endregion

  constructor(
    private fb: FormBuilder,
    private overlay: Overlay,
    private channelService: ChannelDataService,
    private uiService: UiService,
    private router: Router,
    private imageUploadService: ImageUploadService
  ) {}

  // #region Events

  ngOnInit(): void {
    this.serverUrl = environment.api.serverUrl;

    this.allCategories = this.allCategoriesOriginal
      .slice()
      .sort((a, b) => a.localeCompare(b));

    this.newChannelFormGroup = this.fb.group({
      channelNameCtrl: ['', RequiredTextValidation],
      handleCtrl: [''],
      categoryCtrl: '',
      descriptionCtrl: '',
    });

    this.filteredCategories = this.newChannelFormGroup.controls[
      'categoryCtrl'
    ].valueChanges.pipe(
      startWith(null),
      map((category: string | null) =>
        category ? this._filter(category) : this.allCategories.slice()
      )
    );

    this.imageUploadService.imageUrl$.subscribe(
      (uploadImageUrlType: IUploadImageUrlType | null) => {
        this.imageUrlType = uploadImageUrlType;
        if (this.imageUrlType?.imageType === ImageType.Banner) {
          this.bannerImageUrl = this.imageUrlType?.imageUrl;
        } else if (this.imageUrlType?.imageType === ImageType.Profile) {
          this.profileImageUrl = this.imageUrlType?.imageUrl;
        }
      }
    );
  }

  uploadImage($event: MouseEvent, imageType: string) {
    this.imageUploadService.showImageUploadOverlay($event, imageType);
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  protected saveNewChannel() {
    try {
      const formControls = this.newChannelFormGroup.controls;

      if (this.newChannelFormGroup.valid) {
        //check at least one channel category should exist

        if (this.categories.length === 0) {
          this.categories.push('General');
        }

        this.isCreating = true;
        this.newChannelFormGroup.disable();

        setTimeout(() => {
          const newChannelObj: IChannel = {
            userId: 'asifj',
            channelId: 'new-channel',
            name: formControls['channelNameCtrl'].value
              .trim()
              .replace(/\s+/g, ' '),
            description: formControls['descriptionCtrl'].value
              .trim()
              .replace(/\s+/g, ' '),
            category: this.categories.join(','),
            handle: formControls['handleCtrl'].value,
            profileImageUrl: this.profileImageUrl,
            bannerImageUrl: this.bannerImageUrl,
          };

          this.channelService
            .addChannel(newChannelObj, '648b46adfd79ae08df75fd8c')
            .subscribe({
              next: (response) => {
                if (response.status === 200) {
                  this.isCreating = false;
                  this.newChannelFormGroup.enable();
                  this.uiService.showToast(response.message, 800);
                  setTimeout(() => {
                    this.router.navigate([
                      'studio/channel-info',
                      //'617239f3306478b096129ecf',
                      response.channelAdded.channelId,
                    ]);
                  }, 1000);
                }
              },
              error: (responseError) => {
                this.uiService.showToast(
                  responseError.error.errorMessage,
                  2000
                );
                this.isCreating = false;
                this.newChannelFormGroup.enable();
              },
            });
        }, 5000);
      }
    } catch (error) {
      this.isCreating = false;
      this.newChannelFormGroup.enable();
    }
  }

  //#endregion

  //#region [Methods]

  //#region --> [Overlay Methods]

  showInfoPopup(event: MouseEvent, popupType: OverLayType): void {
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
    const popUpInfoOverlayInstance =
      this.overlayRef.attach(infoPopupPortal).instance;

    if (popupType === OverLayType.Banner) {
      popUpInfoOverlayInstance.popupOverLayType = OverLayType.Banner;
    } else if (popupType === OverLayType.Profile) {
      popUpInfoOverlayInstance.popupOverLayType = OverLayType.Profile;
    }

    //Close the overlay when the backdrop is clicked
    this.overlayRef.backdropClick().subscribe(() => {
      this.closePopup();
    });
  }

  private getOverlayConfigForPopups(
    anchorElement: HTMLElement,
    popUpType: OverLayType
  ): OverlayConfig {
    let positionStrategy: any;
    if (popUpType === OverLayType.Banner) {
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
    } else if (popUpType === OverLayType.Profile) {
      positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(anchorElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetX: 10, // Adjust the offset as per your needs
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

  //#endregion --|

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our category

    if (value) {
      this.categories.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.newChannelFormGroup.controls['categoryCtrl'].setValue(null);
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
    this.newChannelFormGroup.controls['categoryCtrl'].setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCategoriesOriginal.filter((category) =>
      category.toLowerCase().includes(filterValue)
    );
  }

  protected generateChannelHandle(channelName: string) {
    if (this.newChannelFormGroup.controls['channelNameCtrl'].valid) {
      channelName = channelName.trim().replace(/\s+/g, ' ');

      const words = channelName.split(' ');

      let handle = '@';

      if (words.length > 0) {
        const firstWord = words[0].slice(0, 7);
        handle += firstWord;

        if (words.length > 1) {
          const secondWord = words[1].slice(0, 6);
          handle += secondWord;

          if (words.length > 2) {
            const thirdWord = words[2].slice(0, 6);
            handle += thirdWord;
          }
        }
      }

      const currentDateTime = new Date();
      const hour = currentDateTime.getHours();
      const minute = currentDateTime.getMinutes();
      const year = currentDateTime.getFullYear().toString().slice(-2);

      handle += hour.toString().padStart(2, '0');
      handle += minute.toString().padStart(2, '0');
      handle += year;

      this.newChannelFormGroup.controls['handleCtrl'].setValue(handle);
    } else {
      this.newChannelFormGroup.controls['handleCtrl'].setValue('');
    }
  }

  //#endregion
}

import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterContentChecked,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ImageType,
  OverLayType,
  VideoPublishStage,
  VideoUploadStatus,
} from 'src/app/models/enums';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {
  Observable,
  Subject,
  auditTime,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Reaction, Video } from 'src/app/models/video';

import { ComponentPortal } from '@angular/cdk/portal';
import { ErrorSets } from 'src/app/shared/directives/field-error/field-error.directive';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { LocationDataService } from 'src/app/services/location-data.service';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
//import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatChipInputEvent } from '@angular/material/chips';
//import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
//import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { RequiredTextValidation } from 'src/app/common/validations';
import { UiService } from 'src/app/common/ui.service';
import { UploadImageUrlType } from 'src/app/models/upload';
import { VideoDataService } from 'src/app/services/videos-data.service';
import { environment } from 'src/environments/environment';
import { languageValidator } from 'src/app/common/custom-validators';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss'],
  standalone: false,
})
export class UploadDetailsComponent implements OnInit, AfterContentChecked {
  //#region "Declaration"

  protected imageType = ImageType;
  protected overlayType = OverLayType;
  protected ErrorSets = ErrorSets;
  protected isCreating = false;
  protected serverUrl: string = '';

  protected videoObj: Video = {
    videoId: '',
    userId: '',
    channelId: '',
    title: '',
    description: '',
    category: '',
    reactions: [],
    comments: [],
    duration: 0,
    videoPathUrl: '',
    thumbnailImageUrl: '',
    audience: '',
    visibility: '',
    commentsPreference: '',
    language: '',
    location: '',
    publishStage: VideoPublishStage.None,
  };

  private destroy$ = new Subject<void>();

  protected separatorKeysCodes: number[] = [ENTER, COMMA];
  protected filteredCategories: Observable<string[]> | undefined;
  protected categories: string[] = [];
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

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  protected basicDetailsFormGroup!: FormGroup;
  protected thumbnailFormGroup!: FormGroup;
  protected audienceFormGroup!: FormGroup;
  protected visibilityFormGroup!: FormGroup;
  //protected uploadVideoGroup!: FormGroup;
  protected isLinear = false;
  private languages: string[] = [
    'English',
    'Mandarin Chinese',
    'Spanish',
    'Hindi',
    'Arabic',
    'Bengali',
    'Portuguese',
    'Russian',
    'Japanese',
    'German',
    'French',
    'Korean',
    'Turkish',
    'Italian',
    'Tamil',
    'Vietnamese',
    'Urdu',
    'Polish',
    'Javanese',
    'Persian',
    'Marathi',
    'Thai',
    'Telugu',
    'Yoruba',
    'Romanian',
    'Malayalam',
    'Dutch',
    'Sindhi',
    'Hausa',
    'Burmese',
    'Kannada',
    'Oriya',
    'Maithili',
    'Serbo-Croatian',
    'Panjabi-Eastern',
    'Ukrainian',
    'Sunda',
    'Pushto',
    'Gujarati',
    'Azerbaijani-South',
    'Awadhi',
    'Panjabi-Western',
    'Bhojpuri',
  ];
  private identifier: string = '';

  protected filteredLanguageOptions: Observable<string[]> | undefined;
  protected filteredLocationOptions: Observable<string[]> | undefined;
  userInputSubject = new Subject<string>();
  formInitialized: boolean = false;

  imageUrlType: UploadImageUrlType | null = null;

  //#endregion

  constructor(
    private formBuilder: FormBuilder,
    private imageUploadService: ImageUploadService,
    private uiService: UiService,
    private locationService: LocationDataService,
    private route: ActivatedRoute,
    private videoService: VideoDataService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.filteredLocationOptions = this.userInputSubject.pipe(
      auditTime(800),
      distinctUntilChanged(),
      switchMap((userInput) => {
        if (userInput.trim() !== '' || userInput.length > 0) {
          return this.locationService.getCitiesCountriesList(userInput);
        } else {
          return of([]); // Return an empty array if the input is empty
        }
      }),
      takeUntil(this.destroy$), // Unsubscribe when the component is destroyed
      tap(() => {})
    );
  }

  //#region "Events"

  ngOnInit(): void {
    this.serverUrl = environment.api.serverUrl;
    this.isLinear = true;

    this.route.paramMap.subscribe((params) => {
      this.identifier = params.get('identifier')!;
    });
  }

  ngAfterContentChecked() {
    if (!this.formInitialized) {
      this.defineFormGroups();
      this.defineLanguageObservable();
      this.defineSubscribers();
      this.formInitialized = true;
    }
  }

  // Unsubscribe when the component is destroyed
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInputChange(event: Event) {
    const userInput = (event.target as HTMLInputElement).value;
    this.userInputSubject.next(userInput);
  }

  //#endregion ---

  //#region "Methods"

  defineFormGroups() {
    this.ngZone.run(() => {
      this.basicDetailsFormGroup = this.formBuilder.group({
        videoTitleCtrl: ['', RequiredTextValidation],
        descriptionCtrl: [''],
        languageCtrl: ['', languageValidator(this.languages)],
        categoryCtrl: '',
        locationCtrl: [''],
      });

      this.thumbnailFormGroup = this.formBuilder.group({
        thumbnailImageCtrl: ['', Validators.required],
      });

      this.audienceFormGroup = this.formBuilder.group({
        audienceOption: ['', Validators.required],
      });

      this.visibilityFormGroup = this.formBuilder.group({
        visibilityOption: ['', Validators.required],
      });
    });
  }

  defineLanguageObservable() {
    this.filteredLanguageOptions = this.basicDetailsFormGroup.controls[
      'languageCtrl'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this.filterLanguage(value || ''))
    );
  }

  defineSubscribers() {
    this.filteredCategories = this.basicDetailsFormGroup.controls[
      'categoryCtrl'
    ].valueChanges.pipe(
      startWith(null),
      map((category: string | null) =>
        category ? this._filter(category) : this.allCategories.slice()
      )
    );

    this.imageUploadService.imageUrl$.subscribe(
      (uploadImageUrlType: UploadImageUrlType | null) => {
        this.imageUrlType = uploadImageUrlType;
        if (this.imageUrlType?.imageUrl) {
          this.thumbnailFormGroup
            .get('thumbnailImageCtrl')
            ?.setValue(this.imageUrlType?.imageUrl);
          this.videoObj.thumbnailImageUrl = this.imageUrlType?.imageUrl;
        }
      }
    );

    this.videoService.getThumbnailHostUrl().subscribe((thumbnailHostUrl) => {
      this.videoObj.thumbnailImageUrl = thumbnailHostUrl;
      //'video/thumbnails/64a7040ef4be255f935aece0.png';
      this.thumbnailFormGroup.controls['thumbnailImageCtrl'].setValue(
        this.videoObj.thumbnailImageUrl
      );
      console.log(this.videoObj.thumbnailImageUrl);
    });

    this.videoService.getVideoHostUrl().subscribe((videoHostUrl) => {
      this.videoObj.videoPathUrl = videoHostUrl;
      console.log(this.videoObj.videoPathUrl);
    });
  }

  private filterLanguage(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.languages.length > 0) {
      return this.languages.filter((lang) =>
        lang.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  prepareBasicDetails() {
    const controls = this.basicDetailsFormGroup.controls;
    this.videoObj.title! = controls['videoTitleCtrl'].value;

    this.videoObj.description = controls['descriptionCtrl'].value;
    this.videoObj.channelId = 'ChannelId';
    this.videoObj.location = controls['locationCtrl'].value;
    this.videoObj.language = controls['languageCtrl'].value;

    if (this.categories.length === 0) {
      this.categories.push('General');
    }

    this.videoObj.category = this.categories.join(',');

    if (this.basicDetailsFormGroup.valid) {
      this.stepper.next();
    }
  }

  uploadImage($event: MouseEvent, imageType: string) {
    this.imageUploadService.showImageUploadOverlay(
      $event,
      imageType,
      this.identifier
    );
  }

  defineAudience() {
    this.videoObj.audience =
      this.audienceFormGroup.controls['audienceOption'].value;

    if (this.audienceFormGroup.valid) {
      this.stepper.next();
    }
  }

  defineVisibility() {
    this.videoObj.visibility =
      this.visibilityFormGroup.controls['visibilityOption'].value;
    if (this.visibilityFormGroup.valid) {
      this.stepper.next();
    }
  }

  saveTheVideo() {
    try {
      this.videoObj.userId = '648b46adfd79ae08df75fd8c';
      this.videoObj.channelId = '4bdcab987658f89c5a61242c';

      if (!this.videoObj.channelId) {
        this.uiService.showToast(
          'You need to associate a video with an existing channel.',
          2000
        );
        return;
      }

      if (!this.identifier) {
        this.uiService.showToast('Invalid/missing video identifier!', 2000);
        return;
      }

      this.videoObj.videoId = this.identifier;
      this.videoObj.commentsPreference = 'blocked';

      console.log(JSON.stringify(this.videoObj));

      this.isCreating = true;

      setTimeout(() => {
        this.videoService.addVideoDocument(this.videoObj).subscribe({
          next: (response) => {
            // Handle the success response
            this.isCreating = false;
            this.uiService.navigationButtonSelected.next('');

            this.uiService
              .showDialog('Video Uploaded', response.message, '', 'Ok', '')
              .subscribe((result: boolean) => {
                if (result) {
                  this.router.navigate([
                    'studio/video-info',
                    response.updatedVideo._id,
                  ]);
                }
              });
          },
          error: (responseError) => {
            this.uiService.showToast(responseError.error.errorMessage, 2000);
            this.isCreating = false;
            console.error('Error adding video document:', responseError);
          },
        });
      }, 8000);
    } catch (error) {
      this.isCreating = false;
    }
  }

  get audienceOption() {
    return this.audienceFormGroup.get('audienceOption')?.value;
  }

  get audienceOptionErrors() {
    return this.audienceFormGroup.get('audienceOption')?.errors;
  }
  get visibilityOption() {
    return this.visibilityFormGroup.get('visibilityOption')?.value;
  }
  get visibilityOptionErrors() {
    return this.visibilityFormGroup.get('visibilityOption')?.errors;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our category

    if (value) {
      this.categories.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.basicDetailsFormGroup.controls['categoryCtrl'].setValue(null);
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
    this.basicDetailsFormGroup.controls['categoryCtrl'].setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCategoriesOriginal.filter((category) =>
      category.toLowerCase().includes(filterValue)
    );
  }

  //#endregion
}

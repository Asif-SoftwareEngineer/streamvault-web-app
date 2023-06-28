import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImageType, OverLayType } from 'src/app/models/enums';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { ErrorSets } from 'src/app/shared/directives/field-error/field-error.directive';
import { IVideo } from 'src/app/models/video';
import { LocationDataService } from 'src/app/services/location-data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OverlayRef } from '@angular/cdk/overlay';
import { RequiredTextValidation } from 'src/app/common/validations';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss'],
  standalone: false,
})
export class UploadDetailsComponent implements OnInit {
  protected imageType = ImageType;
  protected overlayType = OverLayType;
  protected newChannelFormGroup!: FormGroup;
  protected ErrorSets = ErrorSets;
  protected isCreating = false;
  protected serverUrl: string = '';
  protected thumbnailImageUrl: string =
    'channel/banner/hayaasif-file-1687696435583.JPG';
  protected isLocationSearching: boolean = false;

  protected videoObj: IVideo = {
    videoId: '',
    userId: '',
    channelId: '',
    title: '',
    description: '',
    category: '',
    likes: [],
    dislikes: [],
    comments: [],
    duration: undefined,
    videoPathUrl: '',
    thumbnailImageUrl: '',
    audience: '',
    visibilty: '',
    commentsPreference: '',
    language: '',
    location: '',
  };

  // Create a subject to manage the subscription
  private destroy$ = new Subject<void>();

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

  private overlayRef!: OverlayRef;
  protected basicDetailsFormGroup!: FormGroup;
  protected thumbnailFormGroup!: FormGroup;
  protected audienceFormGroup!: FormGroup;
  protected visibilityFormGroup!: FormGroup;
  protected doneGroup!: FormGroup;
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
  private locations: string[] = [];

  protected filteredLanguageOptions: Observable<string[]> | undefined;
  protected filteredLocationOptions: Observable<string[]> | undefined;
  userInputSubject = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationDataService
  ) {
    this.filteredLocationOptions = this.userInputSubject.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      switchMap((userInput) => {
        if (userInput.trim() !== '' || userInput.length > 0) {
          this.isLocationSearching = true;
          return this.locationService.getCitiesCountriesList(userInput);
        } else {
          this.isLocationSearching = false;
          return of([]); // Return an empty array if the input is empty
        }
      }),
      takeUntil(this.destroy$), // Unsubscribe when the component is destroyed
      tap(() => {
        this.isLocationSearching = false;
      })
    );
  }

  ngOnInit(): void {
    this.serverUrl = environment.api.serverUrl;
    this.isLinear = true;

    this.basicDetailsFormGroup = this.formBuilder.group({
      videoTitleCtrl: ['', RequiredTextValidation],
      descriptionCtrl: [''],
      locationCtrl: [''],
      languageCtrl: ['', RequiredTextValidation],
    });

    this.thumbnailFormGroup = this.formBuilder.group({
      thumbnailImageCtrl: ['asdfasdf', RequiredTextValidation],
    });

    this.audienceFormGroup = this.formBuilder.group({
      audienceOption: ['', Validators.required],
    });

    this.visibilityFormGroup = this.formBuilder.group({
      visibilityOption: ['', Validators.required],
    });

    this.defineLanguageObservable();
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

  //#region "Methods"

  defineLanguageObservable() {
    this.filteredLanguageOptions = this.basicDetailsFormGroup.controls[
      'languageCtrl'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this.filterLanguage(value || ''))
    );
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

    if (this.basicDetailsFormGroup.valid) {
      this.stepper.next();
    }
  }

  defineAudience() {
    this.videoObj.audience =
      this.audienceFormGroup.controls['audienceOption'].value;

    if (this.audienceFormGroup.valid) {
      this.stepper.next();
    }
  }

  defineVisibility() {
    this.videoObj.visibilty =
      this.visibilityFormGroup.controls['visibilityOption'].value;
    if (this.visibilityFormGroup.valid) {
      this.stepper.next();
    }
  }

  printTheObject() {
    console.log(JSON.stringify(this.videoObj));
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

  handleThumbnailImageUrl(thumbnailImageUrl: string) {
    this.thumbnailImageUrl = thumbnailImageUrl;
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  //#endregion
  // Getters for easy access in the template
}

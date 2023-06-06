//import { BaseFormDirective } from 'src/app/common/base-form.class';
import { BehaviorSubject, Observable, map, startWith } from 'rxjs';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import {
  EmailValidation,
  MobileNumberValidation,
  RequiredTextValidation,
} from '../../common/validations';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IName, IUser } from 'src/app/models/user';
import { Inject, PLATFORM_ID } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ErrorSets } from '../../user-controls/field-error/field-error.directive';
import { IAccountVerification } from 'src/app/models/account-verification';
import { IMemberPlan } from 'src/app/models/membership-plans';
import { RegistrationDataService } from 'src/app/services/registration.service';
import { Role } from 'src/app/models/enums';
import { SubSink } from 'subsink';
import { UiService } from 'src/app/common/ui.service';
import { isPlatformBrowser } from '@angular/common';
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { TermsOfServiceComponent } from 'src/app/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from 'src/app/privacy-policy/privacy-policy.component';
import {
  countryCodeValidator,
  languageValidator,
} from 'src/app/common/custom-validators';
import { ICountryCode } from 'src/app/models/countryCode';

import {
  parsePhoneNumberFromString,
  getCountryCallingCode,
  AsYouType,
  formatIncompletePhoneNumber,
} from 'libphonenumber-js';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-member-registration',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss'],
})
export class MemberRegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;

  basicInfoFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  codeVerificationFormGroup!: FormGroup;
  membershipPaymentWithPi!: FormGroup;

  languages: string[] = [
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

  countryCodeItems: string[] = [];

  ErrorSets = ErrorSets;
  Role = Role;
  filteredLanguageOptions: Observable<string[]> | undefined;
  filteredCountryCodeItems: Observable<string[]> | undefined;
  isMemberVerified = false;
  isMemberRegistered = false;
  isFormValid = false;
  selectedMemberPlan!: IMemberPlan;
  selectedCountryDialingCode: string = '';
  selectedCountryCode: any;
  phoneNumberParser: AsYouType;

  userObj!: IUser;

  private subs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private _regService: RegistrationDataService,
    //private authService: AuthService,
    //private uiService: UiService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.userObj = {
      name: { first: '', last: '' },
      isProfileDisabled: true,
      language: '',
      role: Role.None,
      age18Above: false,
    } as IUser;
    this.selectedMemberPlan = {} as IMemberPlan;
    this.phoneNumberParser = new AsYouType();
  }

  onStepChange(event: any): void {
    const selectedStep: MatStep = event.selectedStep;

    if (selectedStep && selectedStep.stepControl) {
      const stepControl: FormGroup = selectedStep.stepControl as FormGroup;

      const desiredControl = stepControl.get('code');

      if (desiredControl) {
        this.scrollToBottom();
      }
    }
  }

  scrollToBottom(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth', // Optional: Adds smooth scrolling animation
      });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getCountryCodes(); // API Call
    this.buildBasicInfoForm();
    this.buildContactForm();

    this.defineLanguageObservable();
    this.defineCountryCodeObservable();
  }

  onInputChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue: string = inputElement.value;

    // Parse the input value to extract the country code
    const parsedPhoneNumber = parsePhoneNumberFromString(inputValue);

    if (parsedPhoneNumber) {
      const formattedValue = formatIncompletePhoneNumber(
        inputValue,
        this.selectedCountryCode
      );

      inputElement.value = formattedValue;
    }
  }

  defineCountryCodeObservable() {
    this.filteredCountryCodeItems = this.contactFormGroup.controls[
      'countryCodeCtrl'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCountryCode(value || ''))
    );
  }

  defineLanguageObservable() {
    this.filteredLanguageOptions = this.basicInfoFormGroup.controls[
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

  private filterCountryCode(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.countryCodeItems.length > 0) {
      return this.countryCodeItems.filter((code) =>
        code.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  public getCountryCodes(): void {
    this.countryCodeItems = [];
    this._regService.getCountyCodes().subscribe(
      (countryCodes: ICountryCode[]) => {
        // Handle the response data here
        countryCodes.forEach((countryCode: ICountryCode) => {
          const countryNameWithCode: string = `${countryCode.countryName} (${countryCode.phoneCode}) ${countryCode.iso2Code}`;
          this.countryCodeItems.push(countryNameWithCode);
        });
        this.defineCountryCodeObservable();
      },
      (error: any) => {
        // Handle any errors that occur during the API call
        console.error(error);
      }
    );
  }

  displayFn(countryCode: string) {
    return countryCode;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    // Access the selected option using event.option
    const selectedOption = event.option;

    // Access the value of the selected option
    const selectedCountryCode: string = selectedOption.value;

    const iso2Code: any = selectedCountryCode.substring(
      selectedCountryCode.length - 2
    );

    // Now grab the country code from the getCountries function
    this.selectedCountryCode = iso2Code;
    this.selectedCountryDialingCode = `+${getCountryCallingCode(iso2Code)} `;

    this.contactFormGroup.controls['mobilePhoneCtrl'].setValue(
      this.selectedCountryDialingCode
    );
  }

  handleFormValidity(isValid: boolean) {
    this.isFormValid = isValid;
  }

  handleSelectedOption(plan: IMemberPlan) {
    this.selectedMemberPlan = plan;
  }

  buildBasicInfoForm(initialData?: IUser) {
    //const user = initialData;

    this.basicInfoFormGroup = this._fb.group({
      firstNameCtrl: ['Asif', RequiredTextValidation],
      lastNameCtrl: ['Javed', RequiredTextValidation],
      languageCtrl: [
        'English',
        [Validators.required, languageValidator(this.languages)],
      ],
      ageCtrl: [true, Validators.requiredTrue],
      agreeToTosCtrl: [true, Validators.requiredTrue],
    });
  }

  buildContactForm() {
    this.contactFormGroup = this._fb.group({
      emailCtrl: ['asif.javed.bangash@gmail.com', EmailValidation],
      countryCodeCtrl: [
        '',
        [Validators.required, countryCodeValidator(this.countryCodeItems)],
      ],
      mobilePhoneCtrl: ['', MobileNumberValidation],
    });
  }

  openTermsOfServiceDialog(): void {
    const dialogRef = this.dialog.open(TermsOfServiceComponent, {
      maxWidth: '100%',
      width: '100%',
      height: '100%',
      panelClass: 'full-screen-dialog',
    });
  }

  openPrivacyPolicyDialog() {
    const dialogRef = this.dialog.open(PrivacyPolicyComponent, {
      maxWidth: '100%',
      width: '100%',
      height: '100%',
      panelClass: 'full-screen-dialog',
    });
  }

  prepareBasicInfo() {
    //console.log(this.validateMobileNumber('AU', '0426372202'));

    let userName: IName = {
      first: this.basicInfoFormGroup.controls['firstNameCtrl'].value,
      last: this.basicInfoFormGroup.controls['lastNameCtrl'].value,
    };

    this.userObj.name = userName;

    this.userObj.language =
      this.basicInfoFormGroup.controls['languageCtrl'].value;
    this.userObj.age18Above = this.basicInfoFormGroup.controls['ageCtrl'].value;
    this.userObj.age18Above =
      this.basicInfoFormGroup.controls['agreeToTosCtrl'].value;
    this.userObj.agreeToTerms =
      this.basicInfoFormGroup.controls['agreeToTosCtrl'].value;
    this.userObj.isProfileDisabled = false;
    this.userObj.role = Role.Member;
    this.userObj.registration_date = new Date();
  }

  prepareUserEmailOrPhone() {
    if (this.userObj) {
      this.userObj.email = this.contactFormGroup.controls['emailCtrl'].value;
      this.userObj.mobile = '';
    }

    if (this.userObj) {
      let verifyingUserObj: IAccountVerification = {
        firstName: this.userObj.name.first,
        lastName: this.userObj.name.last,
        email: this.userObj.email!,
        code: '123654',
        isVerified: false,
      };

      console.log('About to invoke the verify Email');

      // this._regService.verifyEmail(verifyingUserObj).subscribe(
      //   (response) => {
      //     console.log(response);
      //     if (response.status == 200) {
      //       this.isMemberVerified = true;
      //     }
      //   },
      //   (responseError) => {}
      // );
    }
  }

  verifyMemberEmail() {
    console.log('This is to verify the email of the user!');
  }

  defineMembershipPlan() {
    if (this.userObj) {
      this.userObj.membership_Type = this.selectedMemberPlan.planType;
    }
  }

  registerMember() {
    this.isMemberRegistered = true;
  }

  getVerificationCode($event: string) {
    console.log($event);
  }

  goToHome() {}
}

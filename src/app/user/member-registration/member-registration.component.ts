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
  FormGroupDirective,
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
import { CaptureContactComponent } from '../capture-contact/capture-contact.component';
import { ContactVerificationComponent } from '../contact-verification/contact-verification.component';

@Component({
  selector: 'app-member-registration',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss'],
})
export class MemberRegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('contactSection', { static: true })
  contactSection!: CaptureContactComponent;

  @ViewChild('codeVerificationSection', { static: true })
  codeVerificationSection!: ContactVerificationComponent;

  @ViewChild(FormGroupDirective)
  formGroupDirective!: FormGroupDirective;
  @ViewChild('stepper') stepper!: MatStepper;

  basicInfoFormGroup!: FormGroup;
  contactSectionGroup!: FormGroup;
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

  ErrorSets = ErrorSets;
  Role = Role;
  filteredLanguageOptions: Observable<string[]> | undefined;
  isMemberVerified = false;
  isMemberRegistered = false;
  isMemberPlanFormValid = false;
  selectedMemberPlan!: IMemberPlan;

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
    this.buildBasicInfoForm();
    this.defineLanguageObservable();
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

  handleFormValidity(isValid: boolean) {
    this.isMemberPlanFormValid = isValid;
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

  prepareContactSection() {
    if (!this.userObj) {
      return;
    }

    this.userObj.email =
      this.contactSection.contactFormGroup.controls['emailCtrl'].value;
    this.userObj.mobile =
      this.contactSection.contactFormGroup.controls['mobilePhoneCtrl'].value;

    // Prepare th Data Transfer Object

    if (this.userObj) {
      let verifyingUserObj: IAccountVerification = {
        firstName: this.userObj.name.first,
        lastName: this.userObj.name.last,
        email: this.userObj.email!,
        code: '',
        isVerified: false,
      };

      console.log('About to invoke the Mobile number verification process');

      this.isMemberVerified = true;

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

  verifyMemberMobileNumber() {
    const verificationCode: string =
      this.codeVerificationSection.codeVerificationFormGroup.controls['code']
        .value;

    // Call an API for mobile number verification.
    // success result : go to the next step
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

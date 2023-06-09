//import { BaseFormDirective } from 'src/app/common/base-form.class';
import { BehaviorSubject, Observable, map, startWith } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { PaymentMode, Role } from 'src/app/models/enums';
import { SubSink } from 'subsink';
import { UiService } from 'src/app/common/ui.service';
import { isPlatformBrowser } from '@angular/common';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { TermsOfServiceComponent } from 'src/app/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from 'src/app/privacy-policy/privacy-policy.component';
import {
  countryCodeValidator,
  languageValidator,
} from 'src/app/common/custom-validators';
import { CaptureContactComponent } from '../capture-contact/capture-contact.component';
import { ContactVerificationComponent } from '../contact-verification/contact-verification.component';
import { MembershipOptionsComponent } from '../membership-options/membership-options.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InterComponentDataService } from 'src/app/services/inter-comp-data.service';

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

  @ViewChild('membershipPlanSection', { static: true })
  membershipPlanSection!: MembershipOptionsComponent;

  @ViewChild(FormGroupDirective)
  formGroupDirective!: FormGroupDirective;
  @ViewChild('stepper') stepper!: MatStepper;

  basicInfoFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;

  contactSectionGroup!: FormGroup;
  codeVerificationFormGroup!: FormGroup;
  membershipPaymentWithPi!: FormGroup;

  contactSectionValidity: FormControl;
  codeVerificationSectionValidity: FormControl;
  membershipPlanSectionValidity: FormControl;
  reviewInformationSectionValidity: FormControl;

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
  selectedMemberPlan: IMemberPlan = {
    planType: '',
    amount: 0,
    paymentMode: PaymentMode.CryptoCurrency,
    currency: 'Pi',
  };

  userObj!: IUser;
  email: string = '';
  mobile: string = '';

  private subs = new SubSink();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private regService: RegistrationDataService,
    private interCompService: InterComponentDataService,
    //private authService: AuthService,
    private uiService: UiService,
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

    this.contactSectionValidity = new FormControl(false);
    this.codeVerificationSectionValidity = new FormControl(false);
    this.membershipPlanSectionValidity = new FormControl(false);
    this.reviewInformationSectionValidity = new FormControl(false);

    this.contactSectionValidity.setErrors({ customError: true });
    this.codeVerificationSectionValidity.setErrors({ customError: true });
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

  buildBasicInfoForm(initialData?: IUser) {
    //const user = initialData;

    this.basicInfoFormGroup = this.fb.group({
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
    this.isMemberVerified = false;
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

    if (this.basicInfoFormGroup.valid) {
      this.stepper.next();
    }
  }

  prepareContactSection() {
    this.isMemberVerified = false;
    this.contactSectionValidity.setErrors({ customError: true });

    this.userObj.email =
      this.contactSection.contactFormGroup.controls['emailCtrl'].value;
    this.userObj.mobile =
      this.contactSection.contactFormGroup.controls['mobilePhoneCtrl'].value;

    if (this.userObj) {
      let verifyingUserObj: IAccountVerification = {
        firstName: this.userObj.name.first,
        lastName: this.userObj.name.last,
        email: this.userObj.email!,
        mobile: this.userObj.mobile,
        code: '',
        isVerified: false,
      };

      this.regService.generateVerificationCode(verifyingUserObj).subscribe({
        next: (response) => {
          if (response.status == 200) {
            this.interCompService.messageSentToMobile(true);
            this.contactSectionValidity.setErrors(null);
            this.uiService.showToast(response.message);
            this.stepper.next();
          }
        },
        error: (responseError) => {
          this.contactSectionValidity.setErrors({ customError: true });
          this.interCompService.messageSentToMobile(false);
          this.uiService.showToast(responseError.error.message);
        },
      });
    }
  }

  verifyMobile() {
    this.isMemberVerified = false;
    this.codeVerificationSectionValidity.setErrors({ customError: true });

    const verificationCode: string =
      this.codeVerificationSection.codeVerificationFormGroup.controls['code']
        .value;

    this.regService
      .verifyMobileNumber(this.userObj.mobile, verificationCode)
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.isMemberVerified = true;
            this.codeVerificationSectionValidity.setErrors(null);
            this.uiService.showToast(response.message);
            this.stepper.next();
          }
        },
        error: (responseError) => {
          this.isMemberVerified = false;
          this.codeVerificationSectionValidity.setErrors({
            customError: true,
          });
          this.uiService.showToast(responseError.error.message);
        },
      });
  }

  defineMembershipPlan() {
    this.isMemberRegistered = false;
    this.membershipPlanSectionValidity.setErrors({ customError: true });

    this.selectedMemberPlan.planType =
      this.membershipPlanSection.selectedPlan.value;
    this.selectedMemberPlan.amount =
      this.membershipPlanSection.planAmount.value;

    this.userObj.membership = this.selectedMemberPlan;
    if (this.userObj.membership.planType) {
      this.membershipPlanSectionValidity.setErrors(null);
      this.stepper.next();
    }
  }

  registerMember() {
    this.isMemberRegistered = false;
    this.reviewInformationSectionValidity.setErrors({ customError: true });

    this.regService.registerAsMember(this.userObj).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.uiService.showToast(response.message);
          this.isMemberRegistered = true;
          this.reviewInformationSectionValidity.setErrors(null);
          this.uiService.showToast(response.message);
          this.stepper.next();
        }
      },
      error: (responseError) => {
        this.isMemberRegistered = false;
        this.reviewInformationSectionValidity.setErrors({ customError: true });
        this.uiService.showToast(responseError.error.message);
      },
    });
  }

  goBackStep() {
    this.stepper.previous();
  }

  goToHome() {}
}

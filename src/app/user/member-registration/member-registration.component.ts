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

import { ActivatedRoute, Router } from '@angular/router';
import { ErrorSets } from 'src/app/shared/directives/field-error/field-error.directive';
import { IAccountVerification } from 'src/app/models/account-verification';
import { MemberPlan } from 'src/app/models/membership-plans';
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

  @ViewChild('stepper') stepper!: MatStepper;

  basicInfoFormGroup!: FormGroup;
  // contactFormGroup!: FormGroup;

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
  selectedMemberPlan: MemberPlan = {
    planType: '',
    amount: 0,
    paymentMode: PaymentMode.CryptoCurrency,
    currency: 'Pi',
  };

  userObj!: IUser;
  email: string = '';
  mobile: string = '';
  isSendingMessage: boolean = false;

  private subs = new SubSink();
  isRegistering: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private regService: RegistrationDataService,
    private interCompService: InterComponentDataService,
    //private authService: AuthService,
    private uiService: UiService,
    private route: ActivatedRoute,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.userObj = {
      name: { first: '', last: '' },
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
      ageCtrl: [false, Validators.requiredTrue],
      agreeToTosCtrl: [false, Validators.requiredTrue],
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
    this.userObj.role = Role.Member;
    this.userObj.registrationDate = new Date();

    if (this.basicInfoFormGroup.valid) {
      this.stepper.next();
    }
  }

  prepareContactSection() {
    console.log(this.userObj);

    return;

    this.isMemberVerified = false;
    this.contactSectionValidity.setErrors({ customError: true });

    this.userObj.email =
      this.contactSection.contactFormGroup.controls['emailCtrl'].value;
    this.userObj.mobile =
      this.contactSection.contactFormGroup.controls['mobilePhoneCtrl'].value;

    this.handleResendClick();
  }

  verifyMobile() {
    this.isMemberVerified = false;
    this.codeVerificationSectionValidity.setErrors({ customError: true });

    const verificationCode: string =
      this.codeVerificationSection.codeVerificationFormGroup.controls['code']
        .value;

    let verifyingUserObj = {
      firstName: this.userObj.name.first,
      lastName: this.userObj.name.last,
      email: this.userObj.email!,
      mobile: this.userObj.mobile,
      code: verificationCode,
    };

    if (this.isValidUserObject()) {
      // Proceed to the next step in code execution
      this.regService
        .verifyMobileNumber(verifyingUserObj as IAccountVerification)
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
            console.log(JSON.stringify(responseError));
            this.isMemberVerified = false;
            this.codeVerificationSectionValidity.setErrors({
              customError: true,
            });
            this.uiService.showToast(responseError.error.errorMessage);
          },
        });
    }
  }

  handleResendClick() {
    if (this.userObj) {
      let verifyingUserObj = {
        firstName: this.userObj.name.first,
        lastName: this.userObj.name.last,
        email: this.userObj.email!,
        mobile: this.userObj.mobile,
      };

      this.isSendingMessage = true;
      this.contactSection.contactFormGroup.disable();

      this.regService.checkRegisteringUser(this.userObj).subscribe({
        next: (response) => {
          if (response.RegStatus === 'MembershipExpired') {
            this.uiService.showToast(response.message);
          } else if (response.RegStatus === 'MembershipActive') {
            this.uiService.showToast(response.message);
          } else if (response.RegStatus === 'unRegistered') {
            this.regService
              .generateVerificationCode(
                verifyingUserObj as IAccountVerification
              )
              .subscribe({
                next: (response) => {
                  console.log(JSON.stringify(response));
                  if (response.status === 200) {
                    this.isSendingMessage = false;
                    this.contactSection.contactFormGroup.enable();
                    this.interCompService.messageSentToMobile(true);
                    this.contactSectionValidity.setErrors(null);
                    this.uiService.showToast(response.message, 2000);
                    this.stepper.next();
                  }
                },
                error: (responseError) => {
                  this.isSendingMessage = false;
                  this.contactSection.contactFormGroup.enable();
                  this.contactSectionValidity.setErrors({ customError: true });
                  this.interCompService.messageSentToMobile(false);
                  this.uiService.showToast(responseError.error.message, 2000);
                },
              });
          }
        },
        error: (responseError) => {
          this.isSendingMessage = false;
          this.contactSection.contactFormGroup.enable();
        },
      });
    }
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
      if (this.isValidUserObject()) {
        this.stepper.next();
      }
    }
  }

  registerMember() {
    this.isMemberRegistered = false;
    this.reviewInformationSectionValidity.setErrors({ customError: true });
    this.isRegistering = true;

    if (this.isValidUserObject()) {
      // Call user Authentication with Pi Network

      // After succesful authentication, call the payment api (with the payload of userObj)

      this.regService.registerAsMember(this.userObj).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.isRegistering = false;
            this.isMemberRegistered = true;
            this.reviewInformationSectionValidity.setErrors(null);
            this.uiService.showToast(response.message);
            this.stepper.next();
          }
        },
        error: (responseError) => {
          this.isMemberRegistered = false;
          this.isRegistering = false;
          this.reviewInformationSectionValidity.setErrors({
            customError: true,
          });
          this.uiService.showToast(responseError.error.message);
        },
      });
    }
  }

  goBackStep() {
    this.stepper.previous();
  }

  goBackStepCodeVerification() {
    let codeCtrl =
      this.codeVerificationSection.codeVerificationFormGroup.controls['code'];

    codeCtrl.setValue('');

    this.stepper.previous();
  }

  isValidUserObject(): boolean {
    if (
      this.userObj.name.first &&
      this.userObj.name.last &&
      this.userObj.email &&
      this.userObj.mobile &&
      this.userObj.language &&
      this.userObj.age18Above &&
      this.userObj.agreeToTerms
    ) {
      return true;
    } else {
      this.uiService.showToast(
        'Please ensure that you provide basic information.',
        5000
      );
      return false;
    }
  }

  goToHome() {
    this._router.navigateByUrl('/user/member-home');
  }

  goToStream() {
    this._router.navigateByUrl('/user/user-home');
  }
}

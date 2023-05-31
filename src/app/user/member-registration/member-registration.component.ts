//import { BaseFormDirective } from 'src/app/common/base-form.class';
import { BehaviorSubject, Observable, map, startWith } from 'rxjs';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  EmailValidation,
  OptionalEmailValidation,
  RequiredTextValidation,
} from '../../common/validations';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IName, IUser } from 'src/app/models/user';

import { ActivatedRoute } from '@angular/router';
import { ErrorSets } from '../../user-controls/field-error/field-error.directive';
import { Role } from 'src/app/models/enums';
import { SubSink } from 'subsink';
import { UiService } from 'src/app/common/ui.service';
import { IMemberPlan } from 'src/app/models/membership-plans';

@Component({
  selector: 'app-member-registration',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss'],
})
export class MemberRegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('langInput', { static: false })
  langInput!: ElementRef;

  basicInfoFormGroup!: FormGroup;
  emailOrPhoneFormGroup!: FormGroup;
  codeVerificationFormGroup!: FormGroup;
  membershipPaymentWithPi!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    //private authService: AuthService,
    //private uiService: UiService,
    private route: ActivatedRoute
  ) {
    this.userObj = {
      name: { first: '', last: '' },
      isProfileDisabled: true,
      language: '',
      role: Role.None,
      age18Above: false,
    } as IUser;
    this.selectedOption = {} as IMemberPlan;
  }

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
  isFormValid = false;
  selectedOption!: IMemberPlan;

  userObj!: IUser;

  private subs = new SubSink();

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.buildBasicInfoForm();
    this.buildEmailOrPhoneForm();
    this.buildCodeVerificationForm();
    this.buildMembershipPaymentWithPiForm();

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
      console.log('there is not city in array');
      return [];
    }
  }

  languageValidator(control: FormControl) {
    const inputValue = control.value;
    if (
      inputValue &&
      !this.languages.some(
        (lang) => lang.toLowerCase() === inputValue.toLowerCase()
      )
    ) {
      return { invalidLanguage: true };
    }
    return null;
  }

  handleFormValidity(isValid: boolean) {
    this.isFormValid = isValid;
  }

  handleSelectedOption(plan: IMemberPlan) {
    this.selectedOption = plan;
  }

  buildBasicInfoForm(initialData?: IUser) {
    //const user = initialData;

    this.basicInfoFormGroup = this._fb.group({
      firstNameCtrl: ['Asif', RequiredTextValidation],
      lastNameCtrl: ['Javed', RequiredTextValidation],
      languageCtrl: [
        '',
        [Validators.required, this.languageValidator.bind(this)],
      ],
      ageCtrl: [false, Validators.requiredTrue],
    });
  }

  buildEmailOrPhoneForm() {
    this.emailOrPhoneFormGroup = this._fb.group({
      emailCtrl: ['my-email@test.com', EmailValidation],
    });
  }

  buildCodeVerificationForm() {
    this.codeVerificationFormGroup = this._fb.group({
      code: ['526314', RequiredTextValidation],
    });
  }

  buildMembershipPaymentWithPiForm() {
    this.membershipPaymentWithPi = this._fb.group({
      option: ['526314', RequiredTextValidation],
    });
  }

  defineBasicInfo() {
    let userName: IName = {
      first: this.basicInfoFormGroup.controls['firstNameCtrl'].value,
      last: this.basicInfoFormGroup.controls['lastNameCtrl'].value,
    };

    this.userObj.name = userName;

    this.userObj.language =
      this.basicInfoFormGroup.controls['languageCtrl'].value;
    this.userObj.age18Above = this.basicInfoFormGroup.controls['ageCtrl'].value;
    this.userObj.isProfileDisabled = false;
    this.userObj.role = Role.Member;
    this.userObj.registration_date = new Date();
  }

  defineUserEmailOrPhone() {
    if (this.userObj) {
      this.userObj.email =
        this.emailOrPhoneFormGroup.controls['emailCtrl'].value;
      this.userObj.mobile = '';
    }
  }

  verifyMemberEmail() {
    console.log('This is to verify the email of the user!');
    this.isMemberVerified = true;
  }

  defineMembershipPlan() {
    if (this.userObj) {
      this.userObj.membership_Type = this.selectedOption.planType;
    }
  }

  registerMember() {
    this.isMemberRegistered = true;
  }

  goToHome() {}
}

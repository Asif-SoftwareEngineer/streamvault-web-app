import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  EmailValidation,
  OptionalEmailValidation,
  RequiredTextValidation,
} from '../../common/validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IName, IUser } from 'src/app/models/user';

import { ActivatedRoute } from '@angular/router';
//import { BaseFormDirective } from 'src/app/common/base-form.class';
import { BehaviorSubject } from 'rxjs';
import { ErrorSets } from '../../user-controls/field-error/field-error.directive';
import { RegistrationDataService } from 'src/app/services/registration.service';
import { Role } from 'src/app/models/enums';
import { SubSink } from 'subsink';
import { UiService } from 'src/app/common/ui.service';

@Component({
  selector: 'app-member-registration',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss'],
})
export class MemberRegistrationComponent implements OnInit, OnDestroy {
  constructor(
    private _fb: FormBuilder,
    private regService: RegistrationDataService,
    //private authService: AuthService,
    //private uiService: UiService,
    private route: ActivatedRoute
  ) {}

  userError = '';

  ErrorSets = ErrorSets;
  Role = Role;
  private subs = new SubSink();

  _basicInfoFormGroup: FormGroup = this._fb.group({});
  _emailOrPhoneFormGroup!: FormGroup;
  _codeVerificationFormGroup!: FormGroup;
  _membershipPaymentWithPi!: FormGroup;

  ngOnDestroy() {
    this.subs.unsubscribe();
    //this.deregisterAllForms();
  }

  ngOnInit(): void {
    this.buildBasicInfoForm();
    this.buildEmailOrPhoneForm();
    this.buildCodeVerificationForm();
    this.buildMembershipPaymentWithPiForm();
  }

  onSubmit(): void {}
  toggleSelection() {}

  buildBasicInfoForm(initialData?: IUser) {
    //const user = initialData;

    this._basicInfoFormGroup = this._fb.group({
      first: ['asif', RequiredTextValidation],
      last: ['javed', RequiredTextValidation],
    });
  }

  buildEmailOrPhoneForm() {
    this._emailOrPhoneFormGroup = this._fb.group({
      email: ['hi@hi.com', EmailValidation],
    });
  }

  buildCodeVerificationForm() {
    this._codeVerificationFormGroup = this._fb.group({
      code: ['526314', RequiredTextValidation],
    });
  }

  buildMembershipPaymentWithPiForm() {
    this._membershipPaymentWithPi = this._fb.group({
      option: ['526314', RequiredTextValidation],
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  EmailValidation,
  RangeTextValidation,
  RequiredTextValidation,
} from '../../common/validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IName, IUser } from 'src/app/models/user';

import { ActivatedRoute } from '@angular/router';
import { BaseFormDirective } from 'src/app/common/base-form.class';
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
export class MemberRegistrationComponent
  extends BaseFormDirective<IUser>
  implements OnInit, OnDestroy
{
  constructor(
    private formBuilder: FormBuilder,
    private regService: RegistrationDataService,
    //private authService: AuthService,
    //private uiService: UiService,
    private route: ActivatedRoute
  ) {
    super();
  }

  userError = '';
  readonly nameInitialData$ = new BehaviorSubject<IName>({
    first: '',
    last: '',
  });

  ErrorSets = ErrorSets;
  Role = Role;
  private subs = new SubSink();

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.deregisterAllForms();
  }

  ngOnInit(): void {
    this.formGroup = this.buildForm();
  }

  onSubmit(): void {}
  toggleSelection() {}

  buildForm(initialData?: IUser): FormGroup {
    console.log('about to build the form');

    const user = initialData;

    const form = this.formBuilder.group({
      email: [user?.email || 'HI@GMAIL.COM', EmailValidation],
      name: [
        user?.name || 'ASIF JAVED',
        [
          RequiredTextValidation,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      //phone: this.formBuilder.array(this.buildPhoneArray(user?.phones || [])),
    });

    return form;
  }
}

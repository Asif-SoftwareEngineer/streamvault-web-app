import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IName, IUser } from 'src/app/models/user';
import { Observable, Observer, Subscription, interval } from 'rxjs';
import {
  RequiredTextValidation,
  VerificationCodeValidation,
} from 'src/app/common/validations';

import { ErrorSets } from 'src/app/user-controls/field-error/field-error.directive';
import { IAccountVerification } from 'src/app/models/account-verification';
import { RegistrationDataService } from 'src/app/services/registration.service';
import { UiService } from 'src/app/common/ui.service';
import { sixDigitCodeValidator } from 'src/app/common/custom-validators';
import { InterComponentDataService } from 'src/app/services/inter-comp-data.service';

@Component({
  selector: 'app-contact-verification',
  templateUrl: './contact-verification.component.html',
  styleUrls: ['./contact-verification.component.scss'],
})
export class ContactVerificationComponent implements OnInit, OnDestroy {
  @Output() throwCodeValue: EventEmitter<string> = new EventEmitter<string>();
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() email: string = '';
  @Input() mobile: string = '';

  private messageSentSubscription: Subscription;

  userObj!: IUser;

  countdown: number = 20;
  showCountdown: boolean = true;
  timer: Subscription = new Subscription();

  codeVerificationFormGroup!: FormGroup;
  ErrorSets = ErrorSets;

  constructor(
    private fb: FormBuilder,
    private interCompDataService: InterComponentDataService,
    private regService: RegistrationDataService,
    //private authService: AuthService,
    private uiService: UiService
  ) {
    this.messageSentSubscription =
      this.interCompDataService.isMessageSent$.subscribe((flag) => {
        if (flag) {
          this.timer.unsubscribe();
          this.startCountdown();
        }
      });
  }

  ngOnInit(): void {
    this.codeVerificationFormGroup = this.fb.group({
      code: new FormControl('', [Validators.required, sixDigitCodeValidator]),
    });
  }

  startCountdown(): void {
    this.countdown = 20;
    this.showCountdown = true;
    this.timer = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.interCompDataService.messageSentToMobileExpired(true);
        this.showCountdown = false;
        this.timer.unsubscribe();
      }
    });
  }

  isAllowedCharacter(char: string): boolean {
    const pattern = /^[0-9]+$/; // Regular expression to match allowed characters
    return pattern.test(char);
  }

  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = [8, 9, 35, 36, 37, 39, 46]; // Allow backspace, tab, enter, and space keys

    if (
      !allowedKeys.includes(event.keyCode) &&
      !this.isAllowedCharacter(event.key)
    ) {
      event.preventDefault();
    }
  }

  emitCode() {
    this.throwCodeValue.emit(
      this.codeVerificationFormGroup.controls['code'].value
    );
  }

  resend(): void {
    // Prepare th Data Transfer Object

    let verifyingUserObj: IAccountVerification = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email!,
      mobile: this.mobile,
      code: '',
      isVerified: false,
    };

    this.regService.generateVerificationCode(verifyingUserObj).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.interCompDataService.messageSentToMobile(true);
          this.uiService.showToast(response.message);
        }
      },
      error: (responseError) => {
        this.uiService.showToast(responseError.error.message, 8000);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.messageSentSubscription.unsubscribe();
  }
}

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

import { ErrorSets } from 'src/app/shared/directives/field-error/field-error.directive';
import { IAccountVerification } from 'src/app/models/account-verification';
import { InterComponentDataService } from 'src/app/services/inter-comp-data.service';
import { RegistrationDataService } from 'src/app/services/registration.service';
import { UiService } from 'src/app/common/ui.service';
import { sixDigitCodeValidator } from 'src/app/common/custom-validators';

@Component({
  selector: 'app-contact-verification',
  templateUrl: './contact-verification.component.html',
  styleUrls: ['./contact-verification.component.scss'],
})
export class ContactVerificationComponent implements OnInit, OnDestroy {
  @Output() throwCodeValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() resendClicked: EventEmitter<void> = new EventEmitter<void>();

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
    private interCompService: InterComponentDataService,
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
    this.countdown = 40;
    this.showCountdown = true;
    this.timer = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
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
    this.codeVerificationFormGroup.controls['code'].setValue('');
    this.resendClicked.emit();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.messageSentSubscription.unsubscribe();
  }
}

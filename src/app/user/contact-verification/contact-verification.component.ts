import {
  Component,
  EventEmitter,
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
import { Observable, Observer, Subscription, interval } from 'rxjs';
import {
  RequiredTextValidation,
  VerificationCodeValidation,
} from 'src/app/common/validations';

import { ErrorSets } from 'src/app/user-controls/field-error/field-error.directive';
import { sixDigitCodeValidator } from 'src/app/common/custom-validators';

@Component({
  selector: 'app-contact-verification',
  templateUrl: './contact-verification.component.html',
  styleUrls: ['./contact-verification.component.scss'],
})
export class ContactVerificationComponent implements OnInit, OnDestroy {
  @Output() throwCodeValue: EventEmitter<string> = new EventEmitter<string>();

  countdown: number = 10;
  showCountdown: boolean = true;
  timer: Subscription = new Subscription();

  codeVerificationFormGroup!: FormGroup;
  ErrorSets = ErrorSets;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.startCountdown();
    this.codeVerificationFormGroup = this._fb.group({
      code: new FormControl('', [Validators.required, sixDigitCodeValidator]),
    });
  }

  startCountdown(): void {
    this.timer = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.showCountdown = false;
        this.timer.unsubscribe();
      }
    });
  }

  emitCode() {
    this.throwCodeValue.emit(
      this.codeVerificationFormGroup.controls['code'].value
    );
  }

  resend(): void {
    // Logic to handle the resend button click
    this.countdown = 10;
    this.showCountdown = true;
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }
}

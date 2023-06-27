import {
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { filter, tap } from 'rxjs/operators';

import { AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';
import { Subscription } from 'rxjs';

export type ValidationError =
  | 'required'
  | 'minlength'
  | 'maxlength'
  | 'invalid'
  | 'invalidCode'
  | 'invalidMobileNumber';

export const ErrorSets: { [key: string]: ValidationError[] } = {
  RequiredText: ['minlength', 'maxlength', 'required'],
  RangeText: ['minlength', 'maxlength'],
  SixDigitCodeText: ['required', 'invalidCode'],
  MobileNumberText: [
    'required',
    'minlength',
    'maxlength',
    'invalidMobileNumber',
  ],
};

@Directive({
  selector: '[appFieldError]',
})
export class FieldErrorDirective implements OnDestroy, OnChanges {
  @Input() appFieldError!:
    | ValidationError
    | ValidationError[]
    | { error: ValidationError; message: string }
    | { error: ValidationError; message: string }[];
  @Input() input: HTMLInputElement | undefined;
  @Input() group!: AbstractControl | null;

  @Input() fieldControl!: AbstractControl | null;
  @Input() fieldLabel: string | undefined;

  private controlSubscription: Subscription | undefined;

  private readonly nativeElement: HTMLElement;

  constructor(private el: ElementRef) {
    this.nativeElement = this.el.nativeElement;
  }

  initFieldControl() {
    if (this.input && this.group) {
      const controlName = this.input.getAttribute('formControlName') ?? '';

      this.fieldControl = this.fieldControl || this.group.get(controlName);

      if (!this.fieldControl) {
        throw new Error(
          `[appFieldError] couldn't bind to control ${controlName}`
        );
      }

      this.unsubscribe();

      this.controlSubscription = this.fieldControl?.valueChanges
        .pipe(
          filter(() => {
            this.nativeElement.innerHTML = '';
            return this.fieldControl?.status === 'INVALID';
          }),
          tap(() => this.updateErrorMessage())
        )
        .subscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initFieldControl();

    if (changes['input'].firstChange) {
      if (this.input) {
        this.input.onblur = () => this.updateErrorMessage();
        this.fieldLabel =
          this.fieldLabel ||
          this.input.placeholder ||
          this.input.getAttribute('aria-label') ||
          '';
      } else {
        throw new Error(
          `appFieldError.[input] couldn't bind to any input element`
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  unsubscribe(): void {
    this.controlSubscription?.unsubscribe();
  }

  updateErrorMessage() {
    const errorsToDisplay: string[] = [];
    const errors = Array.isArray(this.appFieldError)
      ? this.appFieldError
      : [this.appFieldError];

    errors.forEach(
      (
        error: ValidationError | { error: ValidationError; message: string }
      ) => {
        const errorCode = typeof error === 'object' ? error.error : error;
        const message =
          typeof error === 'object'
            ? () => error.message
            : () => this.getStandardErrorMessage(errorCode);
        const errorChecker =
          errorCode === 'invalid'
            ? () => this.fieldControl?.invalid
            : () => this.fieldControl?.hasError(errorCode);

        if (errorChecker()) {
          errorsToDisplay.push(message());
        }
      }
    );

    this.renderErrors(errorsToDisplay.join('<br>'));
  }

  renderErrors(errors: string) {
    this.nativeElement.innerHTML = errors;
  }

  getStandardErrorMessage(error: ValidationError): string {
    const label = this.fieldLabel || 'Input';

    switch (error) {
      case 'required':
        return `${label} is required`;
      case 'minlength':
        return `${label} must be at least ${
          this.fieldControl?.getError(error)?.requiredLength ?? 2
        } characters`;
      case 'maxlength':
        return `${label} can\'t exceed ${
          this.fieldControl?.getError(error)?.requiredLength ?? 50
        } characters`;
      case 'invalidCode':
        return `${label} must be a ${
          this.fieldControl?.getError(error)?.requiredLength ?? 6
        } digits code `;
      case 'invalidMobileNumber':
        return `${label} must be a valid number`;

      case 'invalid':
        return `A valid ${label} is required`;
    }
  }
}

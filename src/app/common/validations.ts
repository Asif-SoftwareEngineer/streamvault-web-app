import {
  mobileNumberValidator,
  sixDigitCodeValidator,
} from './custom-validators';

import { Validators } from '@angular/forms';

export const RangeTextValidation = [
  Validators.minLength(2),
  Validators.maxLength(50),
];
export const RequiredTextValidation = RangeTextValidation.concat([
  Validators.required,
]);
export const OneCharValidation = [
  Validators.minLength(1),
  Validators.maxLength(1),
];

export const VerificationCodeValidation = [
  Validators.required,
  sixDigitCodeValidator,
];

export const MobileNumberValidation = [
  Validators.required,
  Validators.minLength(12),
  Validators.maxLength(19),
  mobileNumberValidator,
];

export const EmailValidation = [Validators.required, Validators.email];

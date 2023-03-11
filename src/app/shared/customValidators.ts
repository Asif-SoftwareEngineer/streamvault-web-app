import { AbstractControl, ValidatorFn } from '@angular/forms';

export function appMinLengthValidator(
  minLength: number,
  errorMessage?: string
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value.length < minLength) {
      return { minLength: { value: errorMessage } };
    }
    return null;
  };
}

export function appMaxLenghtValidator(
  maxLength: number,
  errorMessage?: string
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value.length > maxLength) {
      return { maxLength: { value: errorMessage } };
    }
    return null;
  };
}

// Min Length: "Please enter at least [minLength] characters."
// Max Length: "Please enter no more than [maxLength] characters."
// Email: "Please enter a valid email address."
// File Format: "Please select a file with a [fileFormat] format."

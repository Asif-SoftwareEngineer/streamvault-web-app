import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import parsePhoneNumberFromString from 'libphonenumber-js';

export function sixDigitCodeValidator(
  control: AbstractControl
): ValidationErrors | null {
  const inputValue = control.value;
  const pattern = /^\d{6}$/; // Regex pattern for 6 digits only

  if (inputValue && !pattern.test(inputValue)) {
    return { invalidCode: true };
  }
  return null;
}

export function languageValidator(languages: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputValue = control.value;

    if (
      inputValue &&
      !languages.some((lang) => lang.toLowerCase() === inputValue.toLowerCase())
    ) {
      return { invalidLanguage: true };
    }

    return null;
  };
}

export function countryCodeValidator(countryCodes: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputValue = control.value;

    if (
      inputValue &&
      !countryCodes.some(
        (code) => code.toLowerCase() === inputValue.toLowerCase()
      )
    ) {
      return { invalidCountryCode: true };
    }

    return null;
  };
}

export function mobileNumberValidator(
  control: AbstractControl
): ValidationErrors | null {
  let inputValue = control.value;

  const countryCodeCharacters = inputValue.substring(
    //Check the format of a country code whic is '+61 '
    0,
    inputValue.indexOf(' ') + 1
  );

  const startsWithPlus = countryCodeCharacters.startsWith('+');
  const endsWithSpace = countryCodeCharacters.endsWith(' ');

  if (!startsWithPlus || !endsWithSpace) {
    return { invalidMobileNumber: true }; // The input is not a valid mobile number
  }

  const phoneNumber = parsePhoneNumberFromString(inputValue);

  if (phoneNumber && phoneNumber.isValid()) {
    return null; // The input is a valid mobile number
  } else {
    return { invalidMobileNumber: true }; // The input is not a valid mobile number
  }
}

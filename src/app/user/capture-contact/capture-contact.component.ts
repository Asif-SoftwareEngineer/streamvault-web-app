import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  EmailValidation,
  MobileNumberValidation,
} from 'src/app/common/validations';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import parsePhoneNumberFromString, {
  AsYouType,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
} from 'libphonenumber-js';

import { CountryCode } from 'src/app/models/countryCode';
import { ErrorSets } from 'src/app/shared/directives/field-error/field-error.directive';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RegistrationDataService } from 'src/app/services/registration.service';
import { countryCodeValidator } from 'src/app/common/custom-validators';

@Component({
  selector: 'app-capture-contact',
  templateUrl: './capture-contact.component.html',
  styleUrls: ['./capture-contact.component.scss'],
})
export class CaptureContactComponent implements OnInit {
  @ViewChild('mobile', { static: false })
  inputMobile!: ElementRef<HTMLInputElement>;

  contactFormGroup!: FormGroup;
  countryCodeItems: string[] = [];

  ErrorSets = ErrorSets;
  filteredCountryCodeItems: Observable<string[]> | undefined;
  isFormValid = false;
  selectedCountryDialingCode: string = '';
  selectedCountryCode: any;
  phoneNumberParser: AsYouType;

  constructor(
    private _fb: FormBuilder,
    private _regService: RegistrationDataService,
    private renderer: Renderer2
  ) {
    this.phoneNumberParser = new AsYouType();
  }

  ngOnInit(): void {
    this.getCountryCodes(); // API Call
    this.buildContactForm();
    this.defineCountryCodeObservable();
  }

  buildContactForm() {
    this.contactFormGroup = this._fb.group({
      emailCtrl: ['asif.javed.bangash@gmail.com', EmailValidation],
      countryCodeCtrl: [
        '',
        [Validators.required, countryCodeValidator(this.countryCodeItems)],
      ],
      mobilePhoneCtrl: ['', MobileNumberValidation],
      clearButton: new FormControl({ disabled: false }),
    });
  }

  get textValue() {
    return this.contactFormGroup.controls['countryCodeCtrl'].value;
  }

  clearText() {
    this.contactFormGroup.controls['mobilePhoneCtrl'].setValue('');
    this.contactFormGroup.controls['countryCodeCtrl'].setValue('');
  }

  onInputChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue: string = inputElement.value;

    const parsedPhoneNumber = parsePhoneNumberFromString(inputValue);

    if (parsedPhoneNumber) {
      const formattedValue = formatIncompletePhoneNumber(
        inputValue,
        this.selectedCountryCode
      );

      inputElement.value = formattedValue;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = [8, 9, 13, 32, 35, 36, 37, 39, 46]; // Allow backspace, tab, enter, and space keys

    if (
      !allowedKeys.includes(event.keyCode) &&
      !this.isAllowedCharacter(event.key)
    ) {
      event.preventDefault();
    }
  }

  isAllowedCharacter(char: string): boolean {
    const pattern = /^[+0-9\s]+$/; // Regular expression to match allowed characters
    return pattern.test(char);
  }

  defineCountryCodeObservable() {
    this.filteredCountryCodeItems = this.contactFormGroup.controls[
      'countryCodeCtrl'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCountryCode(value || ''))
    );
  }

  private filterCountryCode(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.countryCodeItems.length > 0) {
      return this.countryCodeItems.filter((code) =>
        code.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  public getCountryCodes(): void {
    this.countryCodeItems = [];
    this._regService.getCountyCodes().subscribe(
      (countryCodes: CountryCode[]) => {
        // Handle the response data here
        countryCodes.forEach((countryCode: CountryCode) => {
          const countryNameWithCode: string = `${countryCode.countryName} (${countryCode.phoneCode}) ${countryCode.iso2Code}`;
          this.countryCodeItems.push(countryNameWithCode);
          this.defineCountryCodeObservable();
        });
      },
      (error: any) => {
        // Handle any errors that occur during the API call
        console.error(error);
      }
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    // Access the selected option using event.option
    const selectedOption = event.option;

    // Access the value of the selected option
    const selectedCountryCode: string = selectedOption.value;

    const iso2Code: any = selectedCountryCode.substring(
      selectedCountryCode.length - 2
    );

    // Now grab the country code from the getCountries function
    this.selectedCountryCode = iso2Code;
    this.selectedCountryDialingCode = `+${getCountryCallingCode(iso2Code)} `;

    this.contactFormGroup.controls['mobilePhoneCtrl'].setValue(
      `${this.selectedCountryDialingCode}25 632 5698`
    );
  }
}

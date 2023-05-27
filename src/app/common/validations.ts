import { Validators } from '@angular/forms'

export const RangeTextValidation = [Validators.minLength(2), Validators.maxLength(50)]
export const RequiredTextValidation = RangeTextValidation.concat([Validators.required])
export const OneCharValidation = [Validators.minLength(1), Validators.maxLength(1)]
export const EmailValidation = [Validators.required, Validators.email]


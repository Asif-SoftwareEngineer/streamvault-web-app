import { Directive, HostListener } from '@angular/core';

import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrimWhieSpace]',
})
export class TrimWhieSpaceDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    console.log('directive:' + value);
    this.ngControl.valueAccessor!.writeValue(value.trim());
  }
}

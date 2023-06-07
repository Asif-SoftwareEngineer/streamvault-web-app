import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { IMemberPlan } from 'src/app/models/membership-plans';

@Component({
  selector: 'app-membership-options',
  templateUrl: './membership-options.component.html',
  styleUrls: ['./membership-options.component.scss'],
})
export class MembershipOptionsComponent implements OnInit {
  isFreeOptionActive = false;
  isMonthlyOptionActive = false;
  isYearlyOptionActive = false;

  selectedPlan: FormControl;
  planAmount: FormControl;

  setOptionActive(option: string, active: boolean) {
    switch (option.toLowerCase()) {
      case 'f':
        {
          this.isFreeOptionActive = active;
          this.isMonthlyOptionActive = false;
          this.isYearlyOptionActive = false;
        }
        break;

      case 'm': {
        this.isMonthlyOptionActive = active;
        this.isFreeOptionActive = false;
        this.isYearlyOptionActive = false;
        break;
      }

      case 'y': {
        this.isYearlyOptionActive = active;
        this.isFreeOptionActive = false;
        this.isMonthlyOptionActive = false;
        break;
      }

      default:
        this.isYearlyOptionActive = false;
        this.isFreeOptionActive = false;
        this.isMonthlyOptionActive = false;
        break;
    }

    if (this.isFreeOptionActive) {
      this.defineMembershipPlan('Free', 0);
    } else if (this.isMonthlyOptionActive) {
      this.defineMembershipPlan('Monthly', 1);
    } else if (this.isYearlyOptionActive) {
      this.defineMembershipPlan('Yearly', 9);
    }
  }

  constructor() {
    this.selectedPlan = new FormControl('Free'); //Default
    this.selectedPlan.addValidators(Validators.required);
    this.planAmount = new FormControl(0); //Default

    this.setOptionActive('f', true);
  }

  defineMembershipPlan(planType: string, amount: number) {
    this.selectedPlan.setValue(planType);
    this.planAmount.setValue(amount);
  }

  ngOnInit(): void {}
}

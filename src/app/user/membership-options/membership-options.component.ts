import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedOptionValue: EventEmitter<IMemberPlan> =
    new EventEmitter<IMemberPlan>();

  setOptionActive(option: string, active: boolean) {
    switch (option) {
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

    this.formValidity.emit(
      this.isFreeOptionActive ||
        this.isMonthlyOptionActive ||
        this.isYearlyOptionActive
    );

    let plan: IMemberPlan = {
      planType: '',
      premium: 0,
    };

    if (this.isFreeOptionActive) {
      plan.planType = 'Free';
      plan.premium = 0;
      this.selectedOptionValue.emit(plan);
    } else if (this.isMonthlyOptionActive) {
      plan.planType = 'Monthly';
      plan.premium = 3;
      this.selectedOptionValue.emit(plan);
    } else if (this.isYearlyOptionActive) {
      plan.planType = 'Yearly';
      plan.premium = 29;
      this.selectedOptionValue.emit(plan);
    }
  }

  constructor() {}

  ngOnInit(): void {}
}

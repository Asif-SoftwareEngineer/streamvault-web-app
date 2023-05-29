import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-membership-options',
  templateUrl: './membership-options.component.html',
  styleUrls: ['./membership-options.component.scss'],
})
export class MembershipOptionsComponent implements OnInit {
  isFreeOptionActive = false;
  isMonthlyOptionActive = false;
  isYearlyOptionActive = false;

  setOptionActive(option: string, active: boolean) {
    switch (option) {
      case 'f':
        {
          console.log(option);
          this.isFreeOptionActive = active;
          this.isMonthlyOptionActive = false;
          this.isYearlyOptionActive = false;
        }
        break;

      case 'm': {
        console.log(option);
        this.isMonthlyOptionActive = active;
        this.isFreeOptionActive = false;
        this.isYearlyOptionActive = false;
        break;
      }

      case 'y': {
        console.log(option);
        this.isYearlyOptionActive = active;
        console.log(this.isYearlyOptionActive);
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
  }

  constructor() {}

  ngOnInit(): void {}
}

import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UiService } from '../common/ui.service';

@Component({
  selector: 'app-app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.scss'],
})
export class AppNavigationComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  // toggleSidenav() {
  //   this.sidenav.toggle();
  // }
  prevActiveButton: string | null = null;
  activeButton: string | null = null;

  constructor(private router: Router, private uiService: UiService) {
    this.uiService.navigationButtonSelected.subscribe((value) => {
      this.activeButton = value;
      if (this.activeButton === 'sideNavClosed') {
        this.activeButton = this.prevActiveButton;
      }
    });
  }

  goHome() {
    this.activeButton = 'home';
    this.router.navigateByUrl('user/user-home');
  }

  goCreate() {
    this.activeButton = 'create';
    this.router.navigateByUrl('studio/list-upload-videos');
  }

  goProfile() {
    this.activeButton = 'profile';
    this.router.navigateByUrl('user/profile/648b46adfd79ae08df75fd8c');
  }

  toggleSideNav() {
    this.prevActiveButton = this.activeButton;
    this.activeButton = 'menu';
    this.uiService.navigationButtonSelected.next(this.activeButton);
    this.toggleSidenav.emit();
  }

  isActiveButton(buttonName: string) {
    return this.activeButton === buttonName;
  }
}

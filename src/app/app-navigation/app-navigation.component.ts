import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.scss'],
})
export class AppNavigationComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @Output() toggleSidenav = new EventEmitter<void>();

  // toggleSidenav() {
  //   this.sidenav.toggle();
  // }
  activeButton: string | null = null;

  constructor(private router: Router) {}

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
}

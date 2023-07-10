import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.scss'],
})
export class AppNavigationComponent implements OnInit {
  activeButton: string | null = null;

  constructor(private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
}

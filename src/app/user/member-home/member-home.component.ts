import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-member-home',
  templateUrl: './member-home.component.html',
  styleUrls: ['./member-home.component.scss'],
})
export class MemberHomeComponent implements OnInit {
  noChannels: boolean = true;
  noAds: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  createChannel() {
    this.router.navigateByUrl('/studio/new-channel');
  }

  createAd() {}
}

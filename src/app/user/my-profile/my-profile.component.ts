import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/user';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  user: User | null = null;
  userId = '648b46adfd79ae08df75fd8c'; // Replace with the actual user ID
  location: string = '';

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userDataService.getUser(this.userId).subscribe({
      next: (user: User) => {
        this.user = user;
        this.defineLocation(user);
        console.log('User:', user);
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
    });
  }

  private defineLocation(user: User) {
    if (user.city && user.country) {
      // Both city and country have values
      this.location = `${user.city} / ${user.country}`;
    } else if (user.city) {
      // Only city has a value
      this.location = user.city;
    } else if (user.country) {
      // Only country has a value
      this.location = user.country;
    } else {
      // Neither city nor country have values
      this.location = 'Unknown';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-member-registration',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss'],
})
export class MemberRegistrationComponent implements OnInit {
  _membershipForm: FormGroup = this._fb.group({});

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {}
  onSubmit(): void {}
}

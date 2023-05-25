import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterValidatorComponent } from './register-validator.component';

describe('RegisterComponent', () => {
  let component: RegisterValidatorComponent;
  let fixture: ComponentFixture<RegisterValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

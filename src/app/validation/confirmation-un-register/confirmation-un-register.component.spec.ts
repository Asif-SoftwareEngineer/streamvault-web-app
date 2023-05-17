import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationUnRegisterComponent } from './confirmation-un-register.component';

describe('ConfirmationUnRegisterComponent', () => {
  let component: ConfirmationUnRegisterComponent;
  let fixture: ComponentFixture<ConfirmationUnRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationUnRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationUnRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

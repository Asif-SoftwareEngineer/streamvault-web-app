import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsValidationDetailsComponent } from './earnings-validation-details.component';

describe('EarningsValidationDetailsComponent', () => {
  let component: EarningsValidationDetailsComponent;
  let fixture: ComponentFixture<EarningsValidationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningsValidationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarningsValidationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

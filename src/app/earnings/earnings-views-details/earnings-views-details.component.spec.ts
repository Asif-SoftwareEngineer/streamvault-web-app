import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsViewsDetailsComponent } from './earnings-views-details.component';

describe('EarningsViewsDetailsComponent', () => {
  let component: EarningsViewsDetailsComponent;
  let fixture: ComponentFixture<EarningsViewsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningsViewsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarningsViewsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

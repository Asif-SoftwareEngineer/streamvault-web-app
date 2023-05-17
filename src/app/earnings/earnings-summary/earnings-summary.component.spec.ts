import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsSummaryComponent } from './earnings-summary.component';

describe('EarningsSummaryComponent', () => {
  let component: EarningsSummaryComponent;
  let fixture: ComponentFixture<EarningsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningsSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarningsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

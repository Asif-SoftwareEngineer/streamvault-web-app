import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndRulesComponent } from './terms-and-rules.component';

describe('TermsAndRulesComponent', () => {
  let component: TermsAndRulesComponent;
  let fixture: ComponentFixture<TermsAndRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndRulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAndRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

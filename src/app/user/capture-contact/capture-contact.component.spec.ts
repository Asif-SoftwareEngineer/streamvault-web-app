import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureContactComponent } from './capture-contact.component';

describe('CaptureContactComponent', () => {
  let component: CaptureContactComponent;
  let fixture: ComponentFixture<CaptureContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptureContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateVideoComponent } from './validate-video.component';

describe('ValidateVideoComponent', () => {
  let component: ValidateVideoComponent;
  let fixture: ComponentFixture<ValidateVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

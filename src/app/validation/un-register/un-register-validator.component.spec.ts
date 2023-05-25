import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnRegisterComponent } from './un-register-validator.component';

describe('UnRegisterComponent', () => {
  let component: UnRegisterComponent;
  let fixture: ComponentFixture<UnRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnRegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

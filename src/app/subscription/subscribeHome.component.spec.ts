import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeHomeComponent } from './subscribeHome.component';

describe('SubscriptionComponent', () => {
  let component: SubscribeHomeComponent;
  let fixture: ComponentFixture<SubscribeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscribeHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

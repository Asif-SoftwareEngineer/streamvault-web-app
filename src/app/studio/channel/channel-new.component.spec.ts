import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelNewComponent } from './channel-new.component';

describe('ChannelNewComponent', () => {
  let component: ChannelNewComponent;
  let fixture: ComponentFixture<ChannelNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

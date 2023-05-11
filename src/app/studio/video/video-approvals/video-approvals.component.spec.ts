import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoApprovalsComponent } from './video-approvals.component';

describe('VideoApprovalsComponent', () => {
  let component: VideoApprovalsComponent;
  let fixture: ComponentFixture<VideoApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoApprovalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

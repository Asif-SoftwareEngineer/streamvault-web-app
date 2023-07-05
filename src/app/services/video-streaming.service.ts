import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { VideoView } from '../models/video';

@Injectable({ providedIn: 'root' })
export class VideoStreamingService {
  private _videoSubject = new BehaviorSubject<VideoView | null>(null);

  setVideo(video: VideoView | null) {
    this._videoSubject.next(video);
  }

  getVideo(): Observable<VideoView | null> {
    return this._videoSubject.asObservable();
  }
}

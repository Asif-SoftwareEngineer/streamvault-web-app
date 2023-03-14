import { BehaviorSubject, Observable } from 'rxjs';

import { IVideoView } from '../models/video';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VideoStreamingService {
  private _videoSubject = new BehaviorSubject<IVideoView | null>(null);

  setVideo(video: IVideoView) {
    this._videoSubject.next(video);
  }

  getVideo(): Observable<IVideoView | null> {
    return this._videoSubject.asObservable();
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IVideo, IVideoView } from '../models/video';
import { Observable, map, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Injectable({
  providedIn: 'root',
})
export class VideoDataService {
  constructor(private http: HttpClient) {}

  getAllVideos(watchingUserId: string): Observable<IVideoView[]> {
    const url = `${apiConfig.baseUrl}video/${watchingUserId}`;
    return this.http.get<{ videosList: IVideoView[] }>(url).pipe(
      map((response) => {
        console.log(response);
        return response.videosList;
      })
    );
  }

  addVideo(videoData: IVideo): Observable<any> {
    const url = `${apiConfig.baseUrl}video/add/${videoData.userId}/${videoData.channelId}`;
    return this.http.post<any>(url, videoData, apiConfig.httpOptions);
  }

  addReactionToVideo(
    userId: string,
    channelId: string,
    videoId: string,
    reActingUserId: string,
    reactionType: string
  ) {
    const url = `${apiConfig.baseUrl}reactions/submit/${userId}/${channelId}/${videoId}/${reActingUserId}/${reactionType}`;
    return this.http.post<any>(url, apiConfig.httpOptions);
  }

  withdrawReactionToVideo(
    userId: string,
    channelId: string,
    videoId: string,
    reActingUserId: string,
    reactionType: string
  ) {
    const url = `${apiConfig.baseUrl}reactions/withdraw/${userId}/${channelId}/${videoId}/${reActingUserId}/${reactionType}`;
    return this.http.post<any>(url, apiConfig.httpOptions);
  }
}

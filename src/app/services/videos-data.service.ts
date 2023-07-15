import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Video, VideoView } from '../models/video';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Injectable({
  providedIn: 'root',
})
export class VideoDataService {
  constructor(private http: HttpClient) {}

  private videoSubjectBase64 = new BehaviorSubject<string>('');
  private videoThumbnailSubjectBase64 = new BehaviorSubject<string>('');

  private thumbnailHostUrl = new BehaviorSubject<string>('');
  private videoHostUrl = new BehaviorSubject<string>('');

  //#region - Behavior Subject - Setters and Getters

  setVideoBase64(url: string) {
    this.videoSubjectBase64.next(url);
  }

  getVideoBase64() {
    return this.videoSubjectBase64.asObservable();
  }

  setThumbnailBase64(url: string) {
    this.videoThumbnailSubjectBase64.next(url);
  }

  getThumbnailBase64() {
    return this.videoThumbnailSubjectBase64.asObservable();
  }

  setThumbnailHostUrl(url: string) {
    this.thumbnailHostUrl.next(url);
  }

  getThumbnailHostUrl() {
    return this.thumbnailHostUrl.asObservable();
  }

  setVideoHostUrl(url: string) {
    this.videoHostUrl.next(url);
  }

  getVideoHostUrl() {
    return this.videoHostUrl.asObservable();
  }

  //#endregion

  getAllVideos(): Observable<VideoView[]> {
    const url = `${apiConfig.baseUrl}videos`;
    return this.http.get<VideoView[]>(url);
  }

  getVideoById(videoId: string): Observable<Video> {
    const url = `${apiConfig.baseUrl}video/${videoId}`;
    console.log(url);
    return this.http.get<Video>(url);
  }

  addVideoDocument(videoData: Video): Observable<any> {
    const url = `${apiConfig.baseUrl}video/addVideoDocument`;
    return this.http.post<any>(url, videoData, apiConfig.httpOptions);
  }

  uploadVideo(
    userId: string,
    channelId: string,
    thumbnail: string,
    video: string,
    fileNameIdentifier: string
  ): Observable<boolean> {
    console.log(fileNameIdentifier);
    const url = `${apiConfig.baseUrl}video/uploadVideo/${userId}/${channelId}/${fileNameIdentifier}`;
    const body = {
      thumbnail,
      video,
    };
    return this.http.post(url, body).pipe(
      map((response: any) => {
        // Check if the upload was successful based on the response
        if (response.status === 201) {
          const savedVidObj = response.video as Video;
          this.setThumbnailHostUrl(savedVidObj.thumbnailImageUrl!);
          this.setVideoHostUrl(savedVidObj.videoPathUrl!);
        }
        return response && response.status === 201;
      }),
      catchError((error: any) => {
        throw error;
      })
    );
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

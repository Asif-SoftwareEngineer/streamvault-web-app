import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { IVideo } from '../models/video';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Injectable({
  providedIn: 'root',
})
export class VideoDataService {
  private videos = [
    {
      id: 1,
      title: 'Angular Fundamentals',
      description:
        'Learn the basics of Angular and start building amazing web applications',
      thumbnail: 'https://i.ytimg.com/vi/pXbEcGUtHgo/maxresdefault.jpg',
      url: 'http://localhost:3000/vidz/1st.mp4',
    },
    {
      id: 2,
      title: 'React Native',
      description:
        'Build cross-platform mobile applications using React Native',
      thumbnail: 'https://i.ytimg.com/vi/pXbEcGUtHgo/maxresdefault.jpg',
      url: 'http://localhost:3000/vidz/2nd.mp4',
    },
    {
      id: 3,
      title: 'Node.js',
      description:
        'Learn how to build scalable and efficient server-side applications with Node.js',
      thumbnail: 'https://i.ytimg.com/vi/RLtyhwFtXQA/maxresdefault.jpg',
      url: 'http://localhost:3000/vidz/3rd.mp4',
    },
    {
      id: 4,
      title: 'Vue.js',
      description: 'Get started with Vue.js and build amazing web applications',
      thumbnail: 'https://i.ytimg.com/vi/Wy9q22isx3U/maxresdefault.jpg',
      url: 'http://localhost:3000/vidz/4th.mp4',
    },
    {
      id: 5,
      title: 'JavaScript',
      description:
        'Learn the fundamentals of JavaScript and start building amazing web applications',
      thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
      url: 'http://localhost:3000/vidz/5th.mp4',
    },
    {
      id: 6,
      title: 'CSS',
      description:
        'Learn how to style your web applications and make them look amazing',
      thumbnail: 'https://i.ytimg.com/vi/yfoY53QXEnI/maxresdefault.jpg',
      url: 'http://localhost:3000/vidz/1st.mp4',
    },
    {
      id: 7,
      title: 'HTML',
      description:
        'Learn the basics of HTML and start building amazing web applications',
      thumbnail: 'https://i.ytimg.com/vi/9cKsq14Kfsw/maxresdefault.jpg',
      url: 'http://localhost:3000/vidz/2nd.mp4',
    },
    {
      id: 8,
      title: 'Bootstrap',
      description:
        'Learn how to build responsive and beautiful web applications using Bootstrap',
      thumbnail: 'https://i.ytimg.com/vi/9cKsq14Kfsw/maxresdefault.jpg',
      url: 'http://localhost:3000/vidz/2nd.mp4',
    },
  ];

  constructor(private http: HttpClient) {}

  getVideos(): Observable<any> {
    return of(this.videos);
  }

  addVideo(videoData: IVideo): Observable<any> {
    return this.http.post<any>(
      `${apiConfig.baseUrl}video/add/${videoData.userId}/${videoData.channelId}`,
      videoData,
      apiConfig.httpOptions
    );
  }
}

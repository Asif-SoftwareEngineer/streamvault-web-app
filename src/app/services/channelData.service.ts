import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { IChannel } from '../models/channel';
import { IUser } from '../models/user';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Injectable({
  providedIn: 'root',
})
export class ChannelDataService {
  // channels: IChannel[] = [
  //   {
  //     userId: '1',
  //     channelId: '1',
  //     logo: 'https://logo1.png',
  //     name: 'This is a very long name of Channel 1',
  //     description: 'This is the first channel',
  //     category: 'Entertainment',
  //     tags: ['Entertainment', 'Fun'],
  //     handle: 'channel1',
  //     privacySubscribers: false,
  //     subscribers: ['1', '2', '3'],
  //   },
  //   {
  //     userId: '2',
  //     channelId: '2',
  //     logo: 'https://logo2.png',
  //     name: 'long name of  Channel 2',
  //     description:
  //       'This is the first channelThis is the first channelThis is the first channel',
  //     category: 'Technology',
  //     tags: ['Technology', 'Innovation'],
  //     handle: 'channel2',
  //     privacySubscribers: true,
  //     subscribers: ['4', '5', '6'],
  //   },
  //   {
  //     userId: '1',
  //     channelId: '3',
  //     logo: 'https://logo2.png',
  //     name: 'Channel 3',
  //     description: 'This is the third channel',
  //     category: 'Finance',
  //     tags: ['Technology', 'Innovation', 'Finance'],
  //     handle: 'channel3',
  //     privacySubscribers: true,
  //     subscribers: ['4', '5', '6', '7', '8'],
  //   },
  // ];

  constructor(private http: HttpClient) {}

  getChannelsByUserId(userId: string): Observable<IChannel[]> {
    const url = `${apiConfig.baseUrl}channels/${userId}`;
    return this.http.get<{ channels: IChannel[] }>(url).pipe(
      map((response) => {
        return response.channels;
      })
    );
  }

  addChannel(channelData: any, userId: string): Observable<any> {
    const url = `${apiConfig.baseUrl}channels/add/${userId}`;
    return this.http.post<any>(url, channelData, apiConfig.httpOptions);
  }


}

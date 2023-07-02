import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { IChannel } from '../models/channel';
import { IUser } from '../models/user';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Injectable({
  providedIn: 'root',
})
export class ChannelDataService {
  constructor(private http: HttpClient) {}

  getChannelsByUserId(userId: string): Observable<IChannel[]> {
    const url = `${apiConfig.baseUrl}channels/${userId}`;
    return this.http.get<{ channels: IChannel[] }>(url).pipe(
      map((response) => {
        return response.channels;
      })
    );
  }

  getChannel(userId: string, channelId: string): Observable<any> {
    const url = `${apiConfig.baseUrl}channel/${userId}/${channelId}`;
    return this.http.get<any>(url, apiConfig.httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        // Handle the error and return an appropriate response
        if (error.status === 404) {
          // Channel not found error
          throw error;
        } else {
          // Other errors
          throw error;
        }
      })
    );
  }

  addChannel(channelData: IChannel, userId: string): Observable<any> {
    const url = `${apiConfig.baseUrl}channels/addChannel/${userId}`;
    return this.http.post<any>(url, channelData, apiConfig.httpOptions).pipe(
      map((response) => {
        return {
          status: response.status,
          message: response.message,
          channelAdded: response.channelAdded,
        };
      }),
      catchError((error) => {
        if (error.status === 404) {
          throw error;
        } else if (error.status === 422) {
          throw error;
        } else {
          throw error;
        }
      })
    );
  }
}

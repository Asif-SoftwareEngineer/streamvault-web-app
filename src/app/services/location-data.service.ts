import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Injectable({
  providedIn: 'root',
})
export class LocationDataService {
  constructor(private http: HttpClient) {}

  getCitiesCountriesList(userInput: string): Observable<string[]> {
    console.log('about to call an api');
    const url = `${apiConfig.baseUrl}location/city-country-list?input=${userInput}`;
    return this.http.get<string[]>(url);
  }
}

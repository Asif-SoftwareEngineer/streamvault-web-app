import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(private http: HttpClient) {}

  getUser(userId: string): Observable<User> {
    const url = `${apiConfig.baseUrl}user/profile/${userId}`;
    return this.http.get<User>(url);
  }

  getMenus(userId: string): Observable<MenuItem[]> {
    const url = `${apiConfig.baseUrl}user/menus/${userId}`;
    return this.http.get<MenuItem[]>(url);
  }
}

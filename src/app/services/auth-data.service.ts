import { BehaviorSubject, Observable, lastValueFrom, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { RegistrationDataService } from './registration.service';
import { Role } from '../models/enums';
import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private _regService: RegistrationDataService,
    private _tokenStorageService: TokenStorageService
  ) {}

  get isAuthenticated$() {
    return this._isAuthenticated.asObservable();
  }

  setIsAuthenticated(value: boolean) {
    this._isAuthenticated.next(value);
    if (!value) {
      this._tokenStorageService.clear();
    }
  }

  logAppVisitor = (): Observable<any> => {
    const url = `${apiConfig.authApiUrl}auth/appVisitor`;
    return this.http.post(url, apiConfig.httpOptions);
  };

  signIn = (token: string): Observable<any> => {
    const url = `${apiConfig.authApiUrl}auth/signin/${token}`;
    return this.http.post<any>(url, apiConfig.httpOptions);
  };

  signOut = async (userId?: string) => {
    if (userId) {
      const url = `${apiConfig.authApiUrl}auth/signout/${userId}`;
      await lastValueFrom(this.http.post<any>(url, apiConfig.httpOptions));
    }

    this._regService.setRegisteredUserSubject({
      name: { first: '', last: '' },
      email: '',
      country: '',
      role: Role.None,
      isProfileDisabled: false,
    });
    this.setIsAuthenticated(false);
  };
}

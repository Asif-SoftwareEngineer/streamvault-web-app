import { BehaviorSubject, Observable, lastValueFrom, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthResult } from '../models/pi-model';
import { IUser } from '../models/user';
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
    private _tokenStorage: TokenStorageService
  ) {}

  private _authResult = new BehaviorSubject<AuthResult>({
    accessToken: '',
    user: {
      uid: '',
      username: '',
    },
  });

  get isAuthenticated$() {
    return this._isAuthenticated.asObservable();
  }

  setIsAuthenticated(value: boolean) {
    this._isAuthenticated.next(value);
    if (!value) {
      this.clearAuthResult();
    }
  }

  setAuthResult(value: AuthResult) {
    this._authResult.next(value);
  }

  getAuthResult() {
    return this._authResult;
  }

  private clearAuthResult() {
    const emptyAuthResult = {
      accessToken: '',
      user: {
        uid: '',
        username: '',
      },
    };
    this._authResult.next(emptyAuthResult);
  }

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
      streamvault_username: '',
      email: '',
      country: '',
      role: Role.None,
      isProfileDisabled: false,
    });
    console.log('about to clear token storage service');

    this._tokenStorage.clear();
    this.setIsAuthenticated(false);
  };
}

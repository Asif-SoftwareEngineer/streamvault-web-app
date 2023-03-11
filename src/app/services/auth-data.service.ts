import { BehaviorSubject, Observable, of } from 'rxjs';
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
  }

  setAuthResult(value: AuthResult) {
    this._authResult.next(value);
  }

  getAuthResult() {
    return this._authResult;
  }

  clearAuthResult() {
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
    const url = `${apiConfig.baseUrl}signin/${token}`;
    return this.http.post<any>(url, apiConfig.httpOptions);
  };

  signOut = () => {
    this._regService.setRegisteredUserSubject({
      streamweb3_username: '',
      email: '',
      country: '',
      role: Role.None,
      isProfileDisabled: false,
    });
    this._tokenStorage.signOut();
    this.setIsAuthenticated(false);
    this.clearAuthResult();
  };
}

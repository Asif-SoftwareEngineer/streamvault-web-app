import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MembershipType, Role } from '../models/enums';

import { IAccountVerification } from '../models/account-verification';
import { ICountryCode } from '../models/countryCode';
import { IUser } from '../models/user';
import { IVideo } from '../models/video';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Injectable({
  providedIn: 'root',
})
export class RegistrationDataService {
  //   // private _user = new BehaviorSubject<{ user: IUser; userType: string }>({
  //   //   user: null,
  //   //   userType: '',
  //   // });

  //   _userWithInitialValues: IUser = {
  //     name: { first: '', last: '' },
  //     email: '',
  //     role: Role.Visitor,
  //     isProfileDisabled: false,
  //   };

  constructor(private http: HttpClient) {}

  generateVerificationCode(
    verifyingUser: IAccountVerification
  ): Observable<any> {
    const url = `${apiConfig.baseUrl}user/generateVerificationCode`;
    return this.http.post<any>(url, verifyingUser, apiConfig.httpOptions);
  }

  verifyMobileNumber(verifyingUser: IAccountVerification): Observable<any> {
    const url = `${apiConfig.baseUrl}user/verifyMobileNumber`;
    return this.http.post<any>(url, verifyingUser, apiConfig.httpOptions);
  }

  getCountyCodes(): Observable<ICountryCode[]> {
    const url = `${apiConfig.baseUrl}location/countryCodes`;
    return this.http.get<ICountryCode[]>(url);
  }

  registerAsMember(membershipData: IUser): Observable<any> {
    const url = `${apiConfig.baseUrl}user/registerAsMember`;
    return this.http.post<any>(url, membershipData, apiConfig.httpOptions);
  }

  checkRegisteringUser(membershipData: IUser): Observable<any> {
    const url = `${apiConfig.baseUrl}user/checkRegisteringUser`;
    return this.http.post<any>(url, membershipData, apiConfig.httpOptions);
  }

  //   getUser(
  //     accessCode: string,
  //     pichainUid: string,
  //     pichainUsername: string
  //   ): Observable<IUser> {
  //     const url = `${apiConfig.baseUrl}user/registeredUser`;
  //     const params = new HttpParams()
  //       .set('accessCode', accessCode)
  //       .set('pichain_uid', pichainUid)
  //       .set('pichain_username', pichainUsername);
  //     const options = { params: params };

  //     return this.http.get<IUser>(url, options).pipe(
  //       tap((data) => {
  //         //this._user.next(data);
  //       }),
  //       catchError((error) => {
  //         this._user.next(this._userWithInitialValues);
  //         return throwError(() => new Error(error.message));
  //       }),
  //       map((data: IUser) => {
  //         let userType = '';
  //         if (data.role === Role.User) {
  //           userType = 'user';
  //         } else if (data.role === Role.Member) {
  //           userType = 'member';
  //         }
  //         return data;
  //       }),
  //       catchError((error) => {
  //         if (error.status === 404) {
  //           this._user.next(this._userWithInitialValues);
  //         }
  //         return throwError(() => new Error(error.message));
  //       })
  //     );
  //   }

  //   // setRegisteredUserSubject(value: { user: IUser; userType: string }) {
  //   //   this._user.next(value);
  //   // }

  //   setRegisteredUserSubject(value: IUser) {
  //     this._user.next(value);
  //   }

  //   getRegisteredUserSubject(): BehaviorSubject<IUser> {
  //     return this._user;
  //   }

  //   registerAsUser(regData: IUser): Observable<any> {
  //     return this.http.post<any>(
  //       `${apiConfig.baseUrl}user/register`,
  //       regData,
  //       apiConfig.httpOptions
  //     );
  //   }

  //   registerAsMember(membershipData: IUser): Observable<any> {
  //     return this.http.post<any>(
  //       `${apiConfig.baseUrl}user/member`,
  //       membershipData,
  //       apiConfig.httpOptions
  //     );
  //  }
}

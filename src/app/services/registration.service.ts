// import {
//   BehaviorSubject,
//   Observable,
//   catchError,
//   map,
//   of,
//   tap,
//   throwError,
// } from 'rxjs';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { MembershipType, Role } from '../models/enums';

// import { IUser } from '../models/user';
// import { IVideo } from '../models/video';
// import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';

// const apiConfig = environment.api;

// @Injectable({
//   providedIn: 'root',
// })
// export class RegistrationDataService {
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

//   private _user = new BehaviorSubject<IUser>(this._userWithInitialValues);

//   private registrations = [
//     {
//       pi_uid: 1,
//       streamvault_username: 'rego_username1',
//       email: 'usrrego101@gmail.com',
//       country: 'Australia',
//       city: 'Melbourne',
//     },
//     {
//       pi_uid: 2,
//       streamvault_username: 'rego_username2',
//       email: 'usrrego102@gmail.com',
//       country: 'Australia',
//       city: 'Melbourne',
//     },
//     {
//       pi_uid: 3,
//       streamvault_username: 'rego_username3',
//       email: 'usrrego103@gmail.com',
//       country: 'Australia',
//       city: 'Melbourne',
//     },
//     {
//       pi_uid: 4,
//       streamvault_username: 'rego_username4',
//       email: 'usrrego104@gmail.com',
//       country: 'Australia',
//       city: 'Melbourne',
//     },
//   ];

//   constructor(private http: HttpClient) {}

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
//   }
// }

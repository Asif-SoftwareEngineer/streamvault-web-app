import { Injectable } from '@angular/core';

const PI_TOKEN_KEY = 'pi-auth-token';
const PI_USER_KEY = 'pi-auth-user';
const APP_TOKEN_KEY = 'app-auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  clear(): void {
    window.sessionStorage.clear();
  }

  public savePiToken(token: string): void {
    window.sessionStorage.removeItem(PI_TOKEN_KEY);
    window.sessionStorage.setItem(PI_TOKEN_KEY, token);
  }

  public getPiToken(): string | null {
    return window.sessionStorage.getItem(PI_TOKEN_KEY);
  }

  public savePiUser(user: any): void {
    window.sessionStorage.removeItem(PI_USER_KEY);
    window.sessionStorage.setItem(PI_USER_KEY, JSON.stringify(user));
  }

  public getPiUser(): any {
    const user = window.sessionStorage.getItem(PI_USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public saveAppToken(token: string): void {
    window.sessionStorage.removeItem(APP_TOKEN_KEY);
    window.sessionStorage.setItem(APP_TOKEN_KEY, JSON.stringify(token));
  }

  public getAppToken(): any {
    const token = window.sessionStorage.getItem(APP_TOKEN_KEY);
    if (token) {
      return JSON.parse(token);
    }
  }
}

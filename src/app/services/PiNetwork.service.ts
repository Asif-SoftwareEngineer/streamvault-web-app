import * as PiModel from '../models/pi-model';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthDataService } from './auth-data.service';
import { IUser } from '../models/user';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { NotificationType } from '../shared/enums';
import { RegistrationDataService } from './registration.service';
import { Role } from '../models/enums';
import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

interface CustomWindow extends Window {
  Pi: any;
}

@Injectable({
  providedIn: 'root',
})
export class PiNetworkService {
  private _isUserRegistered: boolean = false;
  private _isUserMember: boolean = false;

  constructor(
    private http: HttpClient,
    private _authService: AuthDataService,
    private _regService: RegistrationDataService,
    private _tokenStorage: TokenStorageService,
    private _notificationService: NotificationService
  ) {}

  connectWithPiNetwork = (): boolean => {
    const windowRef = window as unknown as CustomWindow;
    let isConnectedWithNetwork: boolean = false;
    let authResult: PiModel.AuthResult;
    const scopes = ['username', 'payments'];

    // const authResult: PiModel.AuthResult = {
    //   accessToken: 'abcdefghi1234321',
    //   user: {
    //     uid: '123',
    //     username: 'asif2202',
    //   },
    // };

    windowRef.Pi.authenticate(scopes, this.onIncompletePaymentFound)
      .then((auth: PiModel.AuthResult) => {
        isConnectedWithNetwork = !authResult.accessToken ? false : true;
        console.log(isConnectedWithNetwork);
        console.log(`Hi there! You're ready to make payments!`);

        if (!isConnectedWithNetwork) {
          this._authService.setIsAuthenticated(false);
          this._tokenStorage.signOut();

          const notification = {
            message: 'Connecting Pi Blockchain failed, Please try later!',
            type: NotificationType.Error,
            timestamp: new Date(),
          };
          this._notificationService.addNotification(notification);
        } else {
          this._regService
            .getUser(
              authResult.accessToken,
              authResult.user.uid,
              authResult.user.username
            )
            .subscribe({
              next: (registeredUser) => {
                this._regService.setRegisteredUserSubject(registeredUser);
                this._authService.setIsAuthenticated(true);
                this._authService.setAuthResult(authResult);
              },
              error: (error) => {
                this._regService.setRegisteredUserSubject({
                  streamvault_username: '',
                  email: '',
                  country: '',
                  role: Role.None,
                  isProfileDisabled: false,
                });
                const notification = {
                  message: 'Connecting Pi Blockchain failed, Please try later!',
                  type: NotificationType.Error,
                  timestamp: new Date(),
                };
                this._notificationService.addNotification(notification);
                console.log(error.error.message);
              },
            });

          // this._tokenStorage.saveToken(authResult.accessToken);
        }
      })
      .catch(function (error: Error) {
        isConnectedWithNetwork = false;
        console.log('Failed to auth');
      });

    return isConnectedWithNetwork;
  };

  signOut = () => {
    this._regService.setRegisteredUserSubject({
      streamvault_username: '',
      email: '',
      country: '',
      role: Role.None,
      isProfileDisabled: false,
    });
    this._tokenStorage.signOut();
    this._authService.setIsAuthenticated(false);
    this._authService.clearAuthResult();
  };

  //;

  createPayment = (
    amount: number,
    memo: string,
    metadata: PiModel.MyPaymentMetadata
  ) => {
    const windowRef = window as unknown as CustomWindow;
    const paymentData = { amount: Number, memo: String, metadata: {} };

    const callbacks = {
      onReadyForServerApproval: this.onReadyForServerApproval,
      onReadyForServerCompletion: this.onReadyForServerCompletion,
      onCancel: this.onCancel,
      onError: this.onError,
    };

    const payment = windowRef.Pi.createPayment(paymentData, callbacks);
    console.log(payment);
  };

  onReadyForServerApproval = (paymentId: string) => {
    console.log('onReadyForServerApproval', paymentId);
    //    axiosClient.post('/payments/approve', {paymentId}, config);
    this.http.post<any>(
      `${apiConfig.baseUrl}/payments/approve`,
      { paymentId },
      apiConfig.httpOptions
    );
  };

  onReadyForServerCompletion = (paymentId: string, txid: string) => {
    console.log('onReadyForServerCompletion', paymentId, txid);
    //axiosClient.post('/payments/complete', {paymentId, txid}, config);
    this.http.post<any>(
      `${apiConfig.baseUrl}/payments/complete`,
      { paymentId, txid },
      apiConfig.httpOptions
    );
  };

  onIncompletePaymentFound = (payment: PiModel.PaymentDTO) => {
    console.log('onIncompletePaymentFound', payment);
    //return axiosClient.post('/payments/incomplete', {payment});
    this.http.post<any>(
      `${apiConfig.baseUrl}/payments/incomplete`,
      { payment },
      apiConfig.httpOptions
    );
  };

  onCancel = (paymentId: string) => {
    console.log('onCancel', paymentId);
    //return axiosClient.post('/payments/cancelled_payment', {paymentId});
    this.http.post<any>(
      `${apiConfig.baseUrl}/payments/cancelled_payment`,
      { paymentId },
      apiConfig.httpOptions
    );
  };

  onError = (error: Error, payment?: PiModel.PaymentDTO) => {
    console.log('onError', error);
    if (payment) {
      console.log(payment);
      // handle the error accordingly
    }
  };
}

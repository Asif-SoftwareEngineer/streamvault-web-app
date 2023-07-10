import * as PiModel from 'src/app/models/pi-model';

import { firstValueFrom, lastValueFrom } from 'rxjs';

import { AuthDataService } from '../services/auth-data.service';
import { EventEmitter } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from './enums';
import { Role } from '../models/enums';
import { TokenStorageService } from '../services/token-storage.service';
import { User } from '../models/user';
import axios from 'axios';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

export const approvalEvent = new EventEmitter<any>();
export const completionEvent = new EventEmitter<any>();
export const cancelEvent = new EventEmitter<any>();
export const incompleteEvent = new EventEmitter<any>();

const onReadyForServerApproval = (paymentId: string) => {
  console.log('onReadyForServerApproval', paymentId);
  try {
    const response = axios.post(`${apiConfig.baseUrl}payments/approve`, {
      paymentId,
    });
    response.then((res) => {
      console.log(res);
      approvalEvent.emit(res.data);
    });
  } catch (error) {
    console.error(error);
  }
};

const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  console.log('onReadyForServerCompletion', paymentId, txid);
  try {
    const response = axios.post(`${apiConfig.baseUrl}payments/complete`, {
      paymentId,
      txid,
    });
    response.then((res) => {
      console.log(res);
      completionEvent.emit(res.data);
    });
  } catch (error) {
    console.error(error);
  }
};

const onIncompletePaymentFound = (payment: PiModel.PaymentDTO) => {
  console.log('onIncompletePaymentFound', payment);
  try {
    const response = axios.post(`${apiConfig.baseUrl}payments/incomplete`, {
      payment,
    });
    response.then((res) => {
      console.log(res);
      incompleteEvent.emit(res.data);
    });
  } catch (error) {
    console.log(error);
  }
};

const onCancel = (paymentId: string) => {
  console.log('onCancel', paymentId);

  try {
    const response = axios.post(
      `${apiConfig.baseUrl}payments/cancelled_payment`,
      { paymentId }
    );
    response.then((res) => {
      console.log(res);
      cancelEvent.emit(res.data);
    });
  } catch (error) {
    console.log(error);
  }
};

const onError = (error: Error, payment?: PiModel.PaymentDTO) => {
  console.log('onError', error);
  if (payment) {
    console.log(payment);
    // handle the error accordingly
  }
};

interface CustomWindow extends Window {
  Pi: any;
}

const updateNotificationService = (
  notificationService: NotificationService
) => {
  const notification = {
    message: 'Connecting Pi Blockchain failed, Please try later!',
    type: NotificationType.Error,
    timestamp: new Date(),
  };
  notificationService.addNotification(notification);
};

export const Pi_Authentication = async (
  authService: AuthDataService,
  tokenStorageService: TokenStorageService,
  //regService: RegistrationDataService,
  notificationService: NotificationService
): Promise<{ isConnected: boolean }> => {
  const scopes = ['username', 'payments'];
  const windowRef = window as unknown as CustomWindow;

  try {
    const piAuth = await windowRef.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    );

    const piToken = piAuth?.accessToken ?? '';

    if (piToken) {
      const response = await lastValueFrom(authService.signIn(piToken));

      console.log(response);

      if (response.status === 200) {
        tokenStorageService.savePiToken(piAuth!.accessToken);
        tokenStorageService.savePiUser(piAuth!.user);
        tokenStorageService.saveAppToken(response.appAccessToken);
        authService.setIsAuthenticated(true);

        try {
          //const registeredUser = await firstValueFrom(
          //regService.getUser(
          //piAuth!.accessToken,
          //piAuth!.user.uid,
          //piAuth!.user.username
          //)
          //);
          //regService.setRegisteredUserSubject(registeredUser!);
        } catch (error) {
          console.log('signing user is not a registered user of stream vault!');
        }

        return { isConnected: true };
      } else {
        authService.signOut();
        updateNotificationService(notificationService);
        return { isConnected: false };
      }
    } else {
      authService.signOut();
      updateNotificationService(notificationService);
      return { isConnected: false };
    }
  } catch (error) {
    console.error(error);

    updateNotificationService(notificationService);

    return { isConnected: false };
  }
};

export const PI_Payments = async (
  amount: number,
  memo: string,
  metadata: PiModel.MyPaymentMetadata
) => {
  const windowRef = window as unknown as CustomWindow;

  const paymentData = { amount, memo, metadata };

  const callbacks = {
    onReadyForServerApproval,
    onReadyForServerCompletion,
    onCancel,
    onError,
  };

  try {
    const paymentDTO = windowRef.Pi.createPayment(paymentData, callbacks);
  } catch (error) {
    console.log('About to initiate the Payment Api in second attempt');

    const scopes = ['username', 'payments'];

    // This means the payment call has failed and it is expecting the payment scope to be redefined. Hence we re-authenticate with PI Network
    const piAuth = await windowRef.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    );

    const piToken = piAuth?.accessToken ?? '';

    if (piToken) {
      //Second Attempt to initiate payments through the Pi Network.
      const paymentDTO = windowRef.Pi.createPayment(paymentData, callbacks);
    }

    //console.log(JSON.stringify(error));
  }
};

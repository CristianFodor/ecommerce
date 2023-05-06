/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { SessionStorageKeys } from "./sessionStorageService/sessionStorageKeys";
import SessionStorageService from "./sessionStorageService/SessionStorageService";

abstract class BaseService {
  public doCall<T>(callProducer: () => Promise<AxiosResponse<T>>, errorMessage?: string): Promise<T> {
    return new Promise((resolve, reject) => {
      callProducer()
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          this.triggerNotificationError(err.response?.data, errorMessage);
          reject(err);
        });
    });
  }

  public triggerNotificationError(response: any, errorMessage?: string): void {
    if (!response) {
      return;
    }

    if (errorMessage) {
      console.error(errorMessage);
    }

    if (response.statusCode === 404) {
      return undefined;
    }

    const capitalizedErrorMessage = response.message.charAt(0).toUpperCase() + response.message.slice(1);

    SessionStorageService.setItem(SessionStorageKeys.displayError, true);
    SessionStorageService.setItem(SessionStorageKeys.displayErrorMessage, capitalizedErrorMessage);
  }
}

export default BaseService;

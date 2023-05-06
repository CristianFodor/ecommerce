/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { SessionStorageKeys } from "./sessionStorageKeys";

class SessionStorageService {
  static setItem(key: string, item: any, ttl = 3600) {
    const expires = moment().unix() + ttl;
    sessionStorage.setItem(
      key,
      JSON.stringify({
        expires,
        data: item,
      }),
    );
  }

  static getItem<T>(key: string, initState?: T, setInitStateWhenExpired = false): any {
    const item = sessionStorage.getItem(key);
    if (!item) {
      return initState ? initState : null;
    }

    const deserializedItem = JSON.parse(item);
    if (!deserializedItem) {
      return null;
    }

    if (!deserializedItem.hasOwnProperty("expires") || !deserializedItem.hasOwnProperty("data") || !deserializedItem.data) {
      return null;
    }

    const expired = moment().unix() >= deserializedItem.expires;
    if (expired) {
      sessionStorage.removeItem(key);
      return setInitStateWhenExpired ? initState : null;
    }

    return deserializedItem.data;
  }

  static getItemRemainingTtl(key: string): number {
    const item = sessionStorage.getItem(key);
    if (!item) {
      return 0;
    }

    const deserializedItem = JSON.parse(item);
    if (!deserializedItem) {
      return 0;
    }

    if (!deserializedItem.hasOwnProperty("expires")) {
      return 0;
    }

    const expired = moment().unix() >= deserializedItem.expires;
    if (expired) {
      sessionStorage.removeItem(key);
      return 0;
    }

    return deserializedItem.expires - moment().unix();
  }

  static removeItem(key: string) {
    sessionStorage.removeItem(key);
  }

  static clear() {
    sessionStorage.clear();
  }

  static addSessionId = (sessionId: string) => {
    const storage = SessionStorageService.getItem(SessionStorageKeys.signedTxSessionsId) ?? [];
    storage.push(sessionId);
    SessionStorageService.setItem(SessionStorageKeys.signedTxSessionsId, storage);
  };

  static deleteSessionId = (sessionId: string) => {
    let storage = SessionStorageService.getItem(SessionStorageKeys.signedTxSessionsId) ?? [];
    storage = storage.filter((session: string) => session !== sessionId);

    if (storage.length > 0) {
      SessionStorageService.setItem(SessionStorageKeys.signedTxSessionsId, storage);
    } else {
      SessionStorageService.removeItem(SessionStorageKeys.signedTxSessionsId);
    }
  };
}

export default SessionStorageService;

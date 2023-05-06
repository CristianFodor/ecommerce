/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";

class LocalStorageService {
  static setItem(key: string, item: any, ttl = 3600) {
    const expires = moment().unix() + ttl;
    const data = JSON.stringify({
      expires,
      data: item,
    });

    localStorage.setItem(key, data);
  }

  static getItem<T>(key: string, initState?: T, setInitStateWhenExpired = false): any {
    const item = localStorage.getItem(key);

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
      localStorage.removeItem(key);
      return setInitStateWhenExpired ? initState : null;
    }

    return deserializedItem.data;
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

export default LocalStorageService;

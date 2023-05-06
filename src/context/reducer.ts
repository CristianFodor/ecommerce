import { ContextState } from "./state";
import {LocalStorageKeys} from "../services/localStorageService/LocalStorageKeys";
import LocalStorageService from "../services/localStorageService/LocalStorageService";

export type ContextAction =
  | {
      type: "setUserSettings";
      userSettings: ContextState["userSettings"];
    }
  | {
      type: "setAuthenticationData";
      jwtToken: ContextState["jwtToken"];
      userSettings: ContextState["userSettings"];
    }
;

export function reducer(state: ContextState, action: ContextAction): ContextState {
  switch (action.type) {
    case "setUserSettings": {
      const { userSettings } = action;
      LocalStorageService.setItem(LocalStorageKeys.userSettings, userSettings, 3600);
      return {
        ...state,
        userSettings,
      };
    }
    case "setAuthenticationData": {
      const { jwtToken, userSettings } = action;
      jwtToken !== "" && jwtToken
        ? LocalStorageService.setItem(LocalStorageKeys.userAuthToken, jwtToken, 3600)
        : LocalStorageService.removeItem(LocalStorageKeys.userAuthToken);

      LocalStorageService.setItem(LocalStorageKeys.userSettings, userSettings, 3600);

      return {
        ...state,
        jwtToken,
        userSettings,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}

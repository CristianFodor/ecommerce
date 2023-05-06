import SessionStorageService from "../services/sessionStorageService/SessionStorageService";
import { SessionStorageKeys } from "../services/sessionStorageService/sessionStorageKeys";
import LocalStorageService from "services/localStorageService/LocalStorageService";
import { LocalStorageKeys } from "services/localStorageService/LocalStorageKeys";
import { logout } from "@multiversx/sdk-dapp/utils";
import {routeNames} from "../routes";
import {ContextDispatch} from "../context";
import {initUserSettings} from "../context/state";


export const clearSessionAndContextForLogout = (dispatch: ContextDispatch): void => {
  dispatch({
    type: "setAuthenticationData",
    jwtToken: "",
    userSettings: initUserSettings,
  });

  clearSessionForLogout();
};

export const clearSessionForLogout = (): void => {
  LocalStorageService.removeItem(LocalStorageKeys.userAuthToken);
  LocalStorageService.removeItem(LocalStorageKeys.userSettings);
  SessionStorageService.removeItem(SessionStorageKeys.logoutReason);
};

export const performLogout = (dispatch: ContextDispatch): void => {
  clearSessionAndContextForLogout(dispatch);
  const callbackUrl = routeNames.home;
  logout(callbackUrl);
};
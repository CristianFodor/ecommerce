import {User} from "../services/UserType";
import LocalStorageService from "../services/localStorageService/LocalStorageService";
import {LocalStorageKeys} from "../services/localStorageService/LocalStorageKeys";

export interface ContextState {
  userSettings: User;
  jwtToken: string;
}

const initialState = (): ContextState => {
  return {
    jwtToken: LocalStorageService.getItem(LocalStorageKeys.userAuthToken),
    userSettings: LocalStorageService.getItem<User>(LocalStorageKeys.userSettings, initUserSettings, true),
  };
};

export const initUserSettings: User = {
  id: "",
  _id: "",
  publicAddress: "",
  username: "",
  roles: "",
};

export default initialState;

/* eslint-disable @typescript-eslint/no-explicit-any */
import {AxiosError, AxiosRequestConfig} from "axios";
import SessionStorageService from "../sessionStorageService/SessionStorageService";
import {SessionStorageKeys} from "../sessionStorageService/sessionStorageKeys";
import LocalStorageService from "services/localStorageService/LocalStorageService";
import {LocalStorageKeys} from "services/localStorageService/LocalStorageKeys";
import {performLogout} from "../../helpers/util.functions";
import {ecommerceApi} from "../../config";
import {ContextDispatch} from "../../context";

export const authorizationRequestInterceptor = (request: any): AxiosRequestConfig => {
    if (ecommerceApi && request.url?.includes(ecommerceApi)) {
        request.headers.Authorization = `Bearer ${LocalStorageService.getItem(LocalStorageKeys.userAuthToken)}`;
    }

    return request;
};

export const rejectResponseInterceptor = (
    error: AxiosError,
    dispatch: ContextDispatch,
    isLoggedIn: boolean,
): Promise<AxiosError> => {
    if (isLoggedIn && isAccessForbiddenByApp(error)) {
        const logOutReason = {
            type: "error",
            text: "Forbidden access",
        };

        performLogout(dispatch);
        SessionStorageService.setItem(SessionStorageKeys.logoutReason, logOutReason);
    }
    return Promise.reject(error);
};

function isAccessForbiddenByApp(error: AxiosError) {
    return (
        ecommerceApi &&
        error?.config?.url?.includes(ecommerceApi) &&
        (error?.response?.status === 401 || error?.response?.status === 403)
    );
}

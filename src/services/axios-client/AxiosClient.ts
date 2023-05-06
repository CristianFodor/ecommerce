import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {ContextDispatch} from "../../context";

class AxiosClient {
  static withAuthorizationRequestInterceptor(requestInterceptor: (request: AxiosRequestConfig) => AxiosRequestConfig): void {
    axios.interceptors.request.use(
      (request) => requestInterceptor(request),
      (error) => Promise.reject(error),
    );
  }

  static withResponseInterceptor(
    rejectResponseInterceptor: (error: AxiosError, dispatch: ContextDispatch, isLoggedIn: boolean) => Promise<AxiosError>,
    dispatch: ContextDispatch,
    isLoggedIn: boolean,
  ): void {
    axios.interceptors.response.use(undefined, (response) => rejectResponseInterceptor(response, dispatch, isLoggedIn));
  }
}

export default AxiosClient;

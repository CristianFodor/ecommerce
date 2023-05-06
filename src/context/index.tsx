import * as React from "react";
import { ContextAction, reducer } from "./reducer";
import initialState, { ContextState } from "./state";
import { useEffect } from "react";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import {authorizationRequestInterceptor, AxiosClient, rejectResponseInterceptor} from "../services/axios-client";

export type ContextDispatch = (action: ContextAction) => void;

export interface ContextType {
  children: React.ReactNode;
}

const Context = React.createContext<ContextState | undefined>(undefined);
const Dispatch = React.createContext<ContextDispatch | undefined>(undefined);

function ContextProvider({ children }: ContextType) {
  const [state, dispatch] = React.useReducer(reducer, initialState());
  const { isLoggedIn } = useGetLoginInfo();

  useEffect(() => {
    registerAxiosInterceptors();
  }, [isLoggedIn]);

  const registerAxiosInterceptors = () => {
    AxiosClient.withAuthorizationRequestInterceptor(authorizationRequestInterceptor);
    AxiosClient.withResponseInterceptor(rejectResponseInterceptor, dispatch, isLoggedIn);
  };

  return (
    <Context.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </Context.Provider>
  );
}

function useContext() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error("useState must be used within a Context.Provider");
  }
  return context;
}

function useDispatch() {
  const context = React.useContext(Dispatch);
  if (context === undefined) {
    throw new Error("useDispatch must be used within a Dispatch.Provider");
  }
  return context;
}

export { ContextProvider, useContext, useDispatch };

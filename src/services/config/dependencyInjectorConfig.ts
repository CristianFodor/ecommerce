import {DependencyInjector, HookTuple, InjectionToken, makeInjector, Token, useInjectorHook} from "@mindspace-io/react";
import UsersService from "../UsersService";
import AuthService from "../AuthService";
import {ecommerceApi, mvxApi} from "../../config";
export const ECOMMERCE_API = new InjectionToken<string>("Ecommerce API");
export const MVX_API = new InjectionToken<string>("MultiversX API");

export const injector: DependencyInjector = makeInjector([
  { provide: ECOMMERCE_API, useValue: ecommerceApi },
  { provide: MVX_API, useValue: mvxApi },
  {
    provide: UsersService,
    useClass: UsersService,
    deps: [ECOMMERCE_API],
  },
  {
    provide: AuthService,
    useClass: AuthService,
    deps: [ECOMMERCE_API],
  },
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useService<T extends Token>(token: T): HookTuple<any, DependencyInjector> {
  return useInjectorHook(token, injector);
}

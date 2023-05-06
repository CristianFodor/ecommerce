import React, {FC, Suspense, useEffect, useState} from "react";
import {useGetAccountInfo, useGetLoginInfo} from "@multiversx/sdk-dapp/hooks";
import UsersService from "../../services/UsersService";
import {useService} from "../../services/config/dependencyInjectorConfig";
import {clearSessionAndContextForLogout, performLogout} from "../../helpers/util.functions";
import {useLocation} from "react-router-dom";
import {mappedRoutes, routeNames} from "../../routes";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import {SessionStorageKeys} from "../../services/sessionStorageService/sessionStorageKeys";
import {useContext, useDispatch} from "../../context";
import {User} from "../../services/UserType";
import LocalStorageService from "../../services/localStorageService/LocalStorageService";
import {LocalStorageKeys} from "../../services/localStorageService/LocalStorageKeys";
import LinearProgress from "@material-ui/core/LinearProgress";

function isAuthenticatedRoute(pathname: string): boolean {
    const mappedRoute = mappedRoutes.find((route) => {
        const parts = pathname.split("/");
        const routeStartPath = parts.length > 2 ? "/" + parts[1] : pathname;
        return route.path === routeStartPath;
    });
    return mappedRoute ? mappedRoute.authenticatedRoute : false;
}

const CheckAuth: FC<React.PropsWithChildren<unknown>> = ({children}) => {
    const {userSettings, jwtToken} = useContext();
    const logoutReason = SessionStorageService.getItem(SessionStorageKeys.logoutReason);
    const [userService] = useService(UsersService);
    const {address} = useGetAccountInfo();
    const loginInfo = useGetLoginInfo();
    const dispatch = useDispatch();
    const {pathname} = useLocation();
    const {isLoggedIn} = useGetLoginInfo();
    const [isUserAuthAndReady, setIsUserAuthAndReady] = useState<boolean>(false);

    const updateLoginRoute = (currentRoute: string | undefined) => {
        if (currentRoute && currentRoute !== routeNames.unlock) {
            SessionStorageService.setItem(SessionStorageKeys.loginRoute, currentRoute);
        }
    };

    const setAuthToken = async () => {
        let jwtTokenInfo: string | undefined = jwtToken;
        let getUser: User | undefined = userSettings;

        if (isLoggedIn && !logoutReason) {
            if (jwtTokenInfo && getUser && getUser.id) {
                setIsUserAuthAndReady(true);
                return;
            }

            if (!jwtTokenInfo) {
                jwtTokenInfo = loginInfo.tokenLogin?.nativeAuthToken;
                if (jwtTokenInfo) {
                    LocalStorageService.setItem(LocalStorageKeys.userAuthToken, jwtTokenInfo, 3600);
                }
            }

            if (jwtTokenInfo && (!getUser || !getUser.id)) {
                getUser = await userService.checkUser(address);
            }

            if (jwtTokenInfo && getUser && (getUser.id || getUser._id)) {
                setIsUserAuthAndReady(true);
                dispatch({
                    type: "setAuthenticationData",
                    jwtToken: jwtTokenInfo,
                    userSettings: getUser,
                });
            } else {
                performLogout(dispatch);
            }
        } else {
            if (jwtTokenInfo || (getUser && getUser.id)) {
                performLogout(dispatch);
            }

            if (
                LocalStorageService.getItem(LocalStorageKeys.userSettings, true) ||
                LocalStorageService.getItem(LocalStorageKeys.userAuthToken, true)
            ) {
                clearSessionAndContextForLogout(dispatch);
            }
        }
    };

    useEffect(() => {
        updateLoginRoute(pathname);
    }, [pathname]);

    useEffect(() => {
        setAuthToken();
    }, []);

    if (isAuthenticatedRoute(pathname) && !isUserAuthAndReady) {
        return <LinearProgress/>;
    }

    return <Suspense fallback={<LinearProgress/>}>{children}</Suspense>;
};

export default CheckAuth;

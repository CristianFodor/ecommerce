import React from "react";
import {EnvironmentsEnum} from "@multiversx/sdk-dapp/types";
import {
    TransactionsToastList,
    SignTransactionsModals,
    NotificationModal
} from "@multiversx/sdk-dapp/UI";
import {
    DappProvider,
    AxiosInterceptorContext // using this is optional
} from "@multiversx/sdk-dapp/wrappers";

import { QueryClient, QueryClientProvider } from 'react-query';
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
import {Layout} from "components";
import {
    apiTimeout,
    walletConnectV2ProjectId,
    sampleAuthenticatedDomains
} from "config";
import { PageNotFound, Unlock } from "pages";
import Shop from './pages/Shop';
import {routeNames} from "routes";
import { routes } from "routes";

const client = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={client}>
        <AxiosInterceptorContext.Provider>
            <AxiosInterceptorContext.Interceptor
                authenticatedDomanis={sampleAuthenticatedDomains}
            >
                <Router>
                    <DappProvider
                        environment={EnvironmentsEnum.devnet}
                        customNetworkConfig={{
                            name: "customConfig",
                            apiTimeout,
                            walletConnectV2ProjectId
                        }}
                    >
                        <Layout>
                            <AxiosInterceptorContext.Listener/>
                            <TransactionsToastList/>
                            <NotificationModal/>
                            <SignTransactionsModals className="custom-class-for-modals"/>
                            <Routes>
                                <Route path={routeNames.unlock} element={<Unlock/>}/>
                                {routes.map((route, index) => (
                                    <Route
                                        path={route.path}
                                        key={"route-key-" + index}
                                        element={<route.component/>}
                                    />
                                ))}
                                <Route path="*" element={<PageNotFound/>}/>
                            </Routes>
                        </Layout>
                    </DappProvider>
                </Router>
            </AxiosInterceptorContext.Interceptor>
            </AxiosInterceptorContext.Provider>
        </QueryClientProvider>
    );
};

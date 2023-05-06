import React from "react";
import {EnvironmentsEnum} from "@multiversx/sdk-dapp/types";
import {NotificationModal, SignTransactionsModals, TransactionsToastList} from "@multiversx/sdk-dapp/UI";
import {DappProvider} from "@multiversx/sdk-dapp/wrappers";

import {QueryClient, QueryClientProvider} from 'react-query';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Layout} from "components";
import {apiTimeout, walletConnectV2ProjectId} from "config";
import {PageNotFound, Unlock} from "pages";
import {routeNames, routes} from "routes";

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
        </QueryClientProvider>
    );
};

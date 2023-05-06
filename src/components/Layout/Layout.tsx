import React from 'react';
import {AuthenticatedRoutesWrapper} from '@multiversx/sdk-dapp/wrappers';
import {useLocation} from 'react-router-dom';
import {routes, routeNames} from 'routes';
import {Footer} from './Footer';
import {ContextProvider} from "../../context";
import CheckAuth from "./checkAuth";
import {NavbarComponent} from "./Navbar";

export const Layout = ({children}: { children: React.ReactNode }) => {
    const {search} = useLocation();

    return (
        <div className='bg-light d-flex flex-column flex-fill wrapper'>
            <ContextProvider>
                <NavbarComponent/>
                <main className='d-flex flex-column flex-grow-1'>
                    <AuthenticatedRoutesWrapper
                        routes={routes}
                        unlockRoute={`${routeNames.unlock}${search}`}
                    >
                        <CheckAuth>
                            {children}
                        </CheckAuth>
                    </AuthenticatedRoutesWrapper>
                </main>
                <Footer/>
            </ContextProvider>
        </div>
    );
};

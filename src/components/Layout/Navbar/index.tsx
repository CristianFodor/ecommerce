import React from 'react';
import {useGetIsLoggedIn} from '@multiversx/sdk-dapp/hooks';
import {logout} from '@multiversx/sdk-dapp/utils';
import {faChartSimple} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Navbar as BsNavbar, NavItem, Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {routeNames} from 'routes';

export const Navbar = () => {
    const isLoggedIn = useGetIsLoggedIn();

    const handleLogout = () => {
        logout(`${window.location.origin}/`);
    };

    return (
        <BsNavbar className='bg-white border-bottom px-4 py-3'>
            <div className='container-fluid'>
                <Link
                    to={isLoggedIn ? routeNames.dashboard : routeNames.home}
                >
                </Link>
                <button className='btn btn-link'>
                <Link
                    to={routeNames.shop}
                    data-testid='shop'
                >
                    Shop
                </Link>
                </button>

                <Nav className='ml-auto'>
                    <NavItem>
                        <button className='btn btn-link'>
                            <Link
                                to={routeNames.unlock}
                                data-testid='unlock'
                            >
                                Sign Up
                            </Link>
                        </button>
                    </NavItem>
                    <NavItem>
                        <button className='btn btn-link'>
                            <Link
                                to={routeNames.unlock}
                                data-testid='unlock'
                            >
                                Login
                            </Link>
                        </button>
                    </NavItem>
                    {isLoggedIn && (
                        <>
                            <NavItem>
                                <Link to={routeNames.statistics} className='nav-link'>
                                    <FontAwesomeIcon
                                        icon={faChartSimple}
                                        className='text-muted'
                                    />
                                </Link>
                            </NavItem>

                            <NavItem>
                                <button className='btn btn-link' onClick={handleLogout}>
                                        Close
                                </button>
                            </NavItem>

                        </>
                    )}
                </Nav>
            </div>
        </BsNavbar>
    );
};

import React from 'react';
import {useGetIsLoggedIn} from '@multiversx/sdk-dapp/hooks';
import {logout} from '@multiversx/sdk-dapp/utils';
import {Nav} from 'react-bootstrap';
import {useService} from "../../../services/config/dependencyInjectorConfig";
import AuthService from "../../../services/AuthService";
import {useContext} from "../../../context";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from "react-router-dom";
import {routeNames} from "../../../routes";

export const NavbarComponent = () => {
    const isLoggedIn = useGetIsLoggedIn();
    const [authService] = useService(AuthService);
    const { userSettings } = useContext();
    const handleLogout = () => {
        logout(`${window.location.origin}/`);
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Ecommerce</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link>
                             <Link to={routeNames.shop} data-testid='shop'>Home</Link>
                        </Nav.Link>
                        {isLoggedIn && !authService.isAdmin(userSettings) &&
                            <Nav.Link>
                                <Link to={routeNames.userOrders} data-testid='userOrders'>My Orders</Link>
                            </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                     {isLoggedIn && authService.isAdmin(userSettings) &&

                         <NavDropdown title="Admin" id="basic-nav-dropdown">
                             <NavDropdown.Item>
                                 <Link to={routeNames.productList} data-testid='productList'>Products</Link>

                             </NavDropdown.Item>
                             <NavDropdown.Item>
                                 <Link to={routeNames.orderList} data-testid='orderList'>Orders</Link>
                             </NavDropdown.Item>
                         </NavDropdown>
                     }
                    
                    {!isLoggedIn &&
                        <Nav.Link>
                            <Link to={routeNames.unlock} data-testid='shop'>Login</Link>
                        </Nav.Link>
                    }
                    {isLoggedIn &&
                        <Nav.Link>
                            <button className='btn btn-link' onClick={handleLogout}>
                                Close
                            </button>
                        </Nav.Link>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

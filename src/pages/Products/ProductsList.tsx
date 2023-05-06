import React, {useEffect} from 'react';
import {useService} from "../../services/config/dependencyInjectorConfig";
import AuthService from "../../services/AuthService";
import {useContext, useDispatch} from "../../context";
import {performLogout} from "../../helpers/util.functions";
import {Button, Table} from "react-bootstrap";

export const ProductList = () => {
    const {userSettings} = useContext();
    const [authService] = useService(AuthService);
    const dispatch = useDispatch();
    const checkIsAdmin = () => {
        if(!authService.isAdmin(userSettings)){
            performLogout(dispatch);
        }
    };

    useEffect(() => {
        checkIsAdmin();
    }, []);

    return (
        <div className="container">
            <div className="d-flex align-items-center">
                <h1>Products List</h1>
                <Button variant="primary ml-auto">Create</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>
                        <div className="d-flex align-items-center">
                            <Button variant="primary mr-2">Edit</Button>
                            <Button variant="primary">Remove</Button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>
                        <div className="d-flex align-items-center">
                            <Button variant="primary mr-2">Edit</Button>
                            <Button variant="primary">Remove</Button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>3</td>
                    <td colSpan={2}>Larry the Bird</td>
                    <td>@twitter</td>
                    <td>
                        <div className="d-flex align-items-center">
                            <Button variant="primary mr-2">Edit</Button>
                            <Button variant="primary">Remove</Button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </Table>
        </div>
    );
};

export default ProductList;
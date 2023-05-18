import React, {useEffect, useState} from 'react';
import {Button, Container, Table} from "react-bootstrap";
import {useContext, useDispatch} from "../../context";
import {useService} from "../../services/config/dependencyInjectorConfig";
import AuthService from "../../services/AuthService";
import {performLogout} from "../../helpers/util.functions";
import OrdersService from "../../services/OrdersService";
import {useQuery} from "react-query";
import {Order} from "../../entities/OrderEntity";
import LinearProgress from "@material-ui/core/LinearProgress";


export const UserOrderList = () => {
    const {userSettings} = useContext();
    const [authService] = useService(AuthService);
    const dispatch = useDispatch();
    const checkIsUser = () => {
        if (!authService.isUser(userSettings)) {
            performLogout(dispatch);
        }
    };

    const [ordersService] = useService(OrdersService);
    const [filterOwner, setFilterOwner] = useState(userSettings._id);
    const {data, isLoading, error} = useQuery({
        queryKey: [`getOrdersOfUser`, filterOwner],
        queryFn: () => ordersService.getOrdersOfUser(filterOwner),
    });

    useEffect(() => {
        checkIsUser();
    }, []);

    const filterByOwner = (owner: string) => {
        setFilterOwner(owner);
    };

    if (isLoading) return <LinearProgress/>;

    return (
        <div className="container">
            <div className="d-flex align-items-center">
                <h1>Orders List</h1>
                <Button variant="primary ml-auto" onClick={() => filterByOwner(userSettings._id)}>Display orders</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Order Id</th>
                    <th>Owner</th>
                    <th>totalPrice</th>
                    <th>Payment</th>
                    <th>Products</th>
                    <th>Created</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((ord: Order) => (
                    <tr key={ord._id}>
                        <td className="text-center">{ord._id}</td>
                        <td className="text-center">{ord.owner.username}</td>
                        <td className="text-center">{ord.totalPrice}</td>
                        <td className="text-center">{ord.paymentType}</td>
                        <td className="text-center">Produse</td>
                        <td className="text-center">{ord.created}</td>
                        <td className="text-center">{ord.status}</td>
                    </tr>))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserOrderList;
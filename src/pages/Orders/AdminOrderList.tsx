import React, {useEffect, useState} from 'react';
import {useContext, useDispatch} from "../../context";
import {useService} from "../../services/config/dependencyInjectorConfig";
import AuthService from "../../services/AuthService";
import {performLogout} from "../../helpers/util.functions";
import {Button, Container, Table} from "react-bootstrap";
import {useQuery} from "react-query";
import OrdersService from "../../services/OrdersService";
import {Order} from "../../entities/OrderEntity";

export const AdminOrderList = () => {
    const {userSettings} = useContext();
    const [authService] = useService(AuthService);
    const dispatch = useDispatch();
    const checkIsAdmin = () => {
        if (!authService.isAdmin(userSettings)) {
            performLogout(dispatch);
        }
    };

    const [ordersService] = useService(OrdersService);
    const [filterStatus, setFilterStatus] = useState('');
    const {data, isLoading, error, refetch} = useQuery({
        queryKey: [`getOrders`, filterStatus],
        queryFn: () => ordersService.getOrders(filterStatus),
    });

    const removeOrder = (orderId: string) => {
        ordersService.deleteOrder(orderId).then(()=> {
            refetch();
            alert("Order has been removed");
        }).catch((error: any) => {
            console.log(error);
        });
    };

    const deliverOrder = (order: Order) =>{
      ordersService.placeOrder(order).then(()=>{
          refetch();
      }).catch((error: any) => {
          console.log(error);
      });
    };

    useEffect(() => {
        checkIsAdmin();
    }, []);

    return (
        <div className="container">
            <div className="d-flex align-items-center">
                <h1>Orders List</h1>
                <Button variant="primary ml-auto">Create</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Order Id</th>
                    <th>Owner</th>
                    <th>totalPrice</th>
                    <th>Products</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((ord: Order) => (
                    <tr key={ord._id}>
                        <td className="text-center">{ord._id}</td>
                        <td className="text-center">{ord.owner.username}</td>
                        <td className="text-center">{ord.totalPrice}</td>
                        <td className="text-center">Produse</td>
                        <td className="text-center">{ord.created}</td>
                        <td className="text-center">{ord.status}</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <button type="button" className="btn btn-outline-info mr-2" onClick={()=>deliverOrder(ord)}>Plaseaza</button>
                                <button type="button" className="btn btn-outline-danger" onClick={() => removeOrder(ord._id)}>Remove</button>
                            </div>
                        </td>
                    </tr>))}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminOrderList;
import React, {useEffect, useState} from 'react';
import {useService} from "../../services/config/dependencyInjectorConfig";
import AuthService from "../../services/AuthService";
import {useContext, useDispatch} from "../../context";
import {performLogout} from "../../helpers/util.functions";
import {Button, Table} from "react-bootstrap";
import {useQuery} from "react-query";
import ProductsService from "../../services/ProductsService";
import {Product} from "../../entities/ProductEntity";
import {routeNames} from "../../routes";
import {Link} from "react-router-dom";

export const ProductList = () => {
    const {userSettings} = useContext();
    const [authService] = useService(AuthService);
    const dispatch = useDispatch();
    const [alertMessage, setAlertMessage] = useState('');
    const checkIsAdmin = () => {
        if (!authService.isAdmin(userSettings)) {
            performLogout(dispatch);
        }
    };

    const [productsService] = useService(ProductsService);
    const [filterCategory, setFilterCategory] = useState('');
    const {data, isLoading, refetch} = useQuery({
        queryKey: [`getProducts`, filterCategory],
        queryFn: () => productsService.getProducts(filterCategory),
    });

    const removeProduct = (productId: string) => {
        productsService.deleteProduct(productId).then(() => {
            refetch();
            setAlertMessage('The product has been removed');
        }).catch((error: any) => {
            console.log(error);
        });
    };

    useEffect(() => {
        checkIsAdmin();
    }, []);


    return (
        <div className="container mt-5">
            <>
                {alertMessage && (
                    <div className="alert alert-success" role="alert">
                        {alertMessage}
                    </div>
                )}
            </>
            <div className="d-flex align-items-center">
                <h1>Products List</h1>
                <div className="ml-auto">
                    <Link to={routeNames.createProduct} data-testid='createProduct'>
                        <Button variant="primary">Create</Button>
                    </Link>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Product Id</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Created</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((prod: Product) => (
                    <tr key={prod._id}>
                        <td className="text-center">{prod._id}</td>
                        <td className="text-center">{prod.title}</td>
                        <td className="text-center">{prod.description}</td>
                        <td className="text-center">{prod.quantity}</td>
                        <td className="text-center"><img src={prod.image} alt="Product Image" width="200" height="200"/>
                        </td>
                        <td className="text-center">{prod.price}</td>
                        <td className="text-center">{prod.category}</td>
                        <td className="text-center">{prod.created}</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <Link to={`${routeNames.editProduct}${prod._id}`} data-testid='editProduct'>
                                    <button type="button" className="btn btn-outline-info mr-2">Edit</button>
                                </Link>
                                <button type="button" className="btn btn-outline-danger"
                                        onClick={() => removeProduct(prod._id)}>Remove
                                </button>
                            </div>
                        </td>
                    </tr>))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductList;
import React, {useEffect, useState} from 'react';
import {useContext, useDispatch} from "../../context";
import {useService} from "../../services/config/dependencyInjectorConfig";
import AuthService from "../../services/AuthService";
import {performLogout} from "../../helpers/util.functions";
import ProductsService from "../../services/ProductsService";
import {useNavigate} from "react-router-dom";
import {routeNames} from "../../routes";

const initialState = {
    title: "",
    description: "",
    quantity: "",
    image: "",
    price: "",
    category: "",
    created: ""
};

const CreateProduct = () => {
    const navigate = useNavigate();
    const {userSettings} = useContext();
    const [authService] = useService(AuthService);
    const dispatch = useDispatch();
    const checkIsAdmin = () => {
        if (!authService.isAdmin(userSettings)) {
            performLogout(dispatch);
        }
    };

    const [productsService] = useService(ProductsService);
    const [productSave, setProductSave] = useState(initialState);
    const {title, description, quantity, image, price, category, created} = productSave;
    const addProduct = async (data: any) => {
        productsService.createProduct(data).then(() => {
            setProductSave(initialState);
            navigate(routeNames.productList);
            alert("Product has been added");
        }).catch((error: any) => {
            console.log(error);
        });
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        addProduct(productSave);
    };
    const handleInputChange = (e: any) => {
        setProductSave({...productSave, [e.target.name]: e.target.value});
    };

    useEffect(() => {
        checkIsAdmin();
    }, []);

    return (
        <>
            <h1>Create Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group mr-3 ml-3">
                    <label>Title</label>
                    <input type="text" className="form-control" placeholder="Product Title" onChange={handleInputChange}
                           name="title" value={title}/>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Description</label>
                    <textarea className="form-control" placeholder="Product Description" onChange={handleInputChange}
                              name="description" value={description}></textarea>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Quantity</label>
                    <input type="number" min="1" className="form-control" placeholder="Quantity"
                           name="quantity" style={{width: '100px'}} onChange={handleInputChange} value={quantity}/>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Image</label>
                    <input type="text" min="1" className="form-control" placeholder="Image Link"
                           name="image" onChange={handleInputChange} value={image}/>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Price</label>
                    <input type="number" min="1" className="form-control" placeholder="Price" style={{width: '100px'}}
                           name="price" onChange={handleInputChange} value={price}/>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Category</label>
                    <select className="custom-select" onChange={handleInputChange} value={category} name="category">
                        <option value="Accessory">Accessory</option>
                        <option value="Tshirt">T-shirt</option>
                        <option value="Blouse">Blouse</option>
                        <option value="Dress">Dress</option>
                        <option value="Jacket">Jacket</option>
                    </select>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Created</label>
                    <input type="date" className="form-control" placeholder="Product Created"
                           onChange={handleInputChange} value={created} name="created"/>
                </div>
                <button type="submit" className="btn btn-primary" style={{margin: '0 auto', display: 'block'}}
                        onClick={addProduct}>Save
                </button>
            </form>
        </>
    );
};

export default CreateProduct;

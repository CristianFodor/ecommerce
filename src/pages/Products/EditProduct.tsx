import React, {useEffect, useState} from 'react';
import {useContext, useDispatch} from "../../context";
import {useService} from "../../services/config/dependencyInjectorConfig";
import AuthService from "../../services/AuthService";
import {performLogout} from "../../helpers/util.functions";
import ProductsService from "../../services/ProductsService";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";

const CreateProduct = () => {
    const [productsService] = useService(ProductsService);
    const { productId } = useParams();
    console.log(productId);

    // get Product Details

    // const {data, isLoading, refetch} = useQuery({
    //     queryKey: [`getProducts`, filterCategory],
    //     queryFn: () => productsService.getProducts(filterCategory),
    // });

    const {userSettings} = useContext();
    const [authService] = useService(AuthService);
    const dispatch = useDispatch();
    const checkIsAdmin = () => {
        if(!authService.isAdmin(userSettings)){
            performLogout(dispatch);
        }
    };

    const [productID, setProductID] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [created, setCreated] = useState('');

    useEffect(() => {
        checkIsAdmin();
    }, []);

    /*const createdProduct = () => {
        const productDTO = [];
        productDTO.push({
            productID: setProductID,
            title: setTitle,
            description: setDescription(),
            quantity: setQuantity,
            image: setImage(),
            price: setPrice(),
            category: setCategory(),
            created: setCreated
        });

        const data: Product = {product: productDTO};

    productsService.createProduct(data).then(()=> {
            alert("Product has been added");
        }).catch((error: any) => {
            console.log(error);
        });
    };*/


    return (
        <>
            <h1>Create Product</h1>
            <form>
                <div className="form-group mr-3 ml-3">
                    <label>Product ID</label>
                    <input type="text" className="form-control" placeholder="Product ID"
                           onChange={(e) => setProductID((e.target.value))}/>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Title</label>
                    <input type="text" className="form-control" placeholder="Product Title"
                           onChange={(e) => setTitle((e.target.value))}/>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Description</label>
                    <textarea className="form-control" placeholder="Product Description"
                              onChange={(e) => setDescription((e.target.value))}></textarea>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Quantity</label>
                    <input type="number" min="1" className="form-control" placeholder="Quantity"
                           style={{width: '100px'}} onChange={(e) => setQuantity((e.target.value))}/>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Image</label>
                    <input type="file" className="form-control-file" onChange={(e) => setImage((e.target.value))}/>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Price</label>
                    <input type="number" min="1" className="form-control" placeholder="Price" style={{width: '100px'}}
                           onChange={(e) => setPrice((e.target.value))}/>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Category</label>
                    <select className="custom-select" onChange={(e) => setCategory((e.target.value))}>
                        <option value="Accessory">Accessory</option>
                        <option value="Tshirt">T-shirt</option>
                        <option value="Blouse">Blouse</option>
                        <option value="Dress">Dress</option>
                        <option value="Jacket">Jacket</option>
                    </select>
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>Created</label>
                    <input type="date" className="form-control" placeholder="Product Created"  onChange={(e)=>setCreated((e.target.value))}/>
                </div>
                <button type="submit" className="btn btn-primary" style={{margin: '0 auto', display: 'block'}} >Save
                </button>
            </form>
        </>
    );
};

export default CreateProduct;

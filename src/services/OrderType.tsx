import {Product} from "../entities/ProductEntity";

export interface ProductOrder {
    product: Product;
    quantity: number;
}
export interface Order {
    id: string;
    _id: string;
    products: ProductOrder[];
    publicAddress: string;
    totalPrice: number;
    created: string;
    status: string;
    roles: string;
}
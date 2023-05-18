import {User} from "../services/UserType";
import {Product} from "./ProductEntity";

export interface ProductOrder {
    product: Product;
    quantity: number;
}
export interface Order extends Document{
    _id: string;
    owner: User;
    paymentType: string;
    totalPrice: number;
    products: ProductOrder[];
    created: string;
    status: string;
}

export interface CreateOrderDTO {
    paymentType: string;
    products: {
        product: PartialProduct;
        quantity: number;
    }[];
}

export interface PartialProduct{
    id: string;
    title: string;
    price: number;
}
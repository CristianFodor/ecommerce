import {User} from "../services/UserType";

export interface Product extends Document{
    _id: string;
    owner: User;
    title: string;
    image: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    created: string;
}
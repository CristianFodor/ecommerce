import axios from "axios";
import BaseService from "./BaseService";
import {CreateOrderDTO, Order} from "../entities/OrderEntity";

export class OrdersService extends BaseService {
    private readonly _ecommerceApi: string;

    constructor(api: string) {
        super();
        this._ecommerceApi = api;
    }

    public async getOrders(filterStatus?: string): Promise<Order> {
        return this.doCall(() => axios.get<Order>(`${this._ecommerceApi}/api/order`, {params: {status: filterStatus}}));
    }
    public async getOrdersOfUser(filterOwner?: string): Promise<Order> {
        return this.doCall(() => axios.get<Order>(`${this._ecommerceApi}/api/order/owner`, {params: {owner: filterOwner}}));
    }

    public async createUserOrder(createOrderDTO: CreateOrderDTO): Promise<Order> {
        return this.doCall(() => axios.post<Order>(`${this._ecommerceApi}/api/order`, createOrderDTO));
    }
    public async placeOrder(createOrderDTO: Order): Promise<Order> {
        return this.doCall(() => axios.put<Order>(`${this._ecommerceApi}/api/order/place/`, createOrderDTO));
    }

    public async deleteOrder(orderId: string): Promise<Order> {
        return this.doCall(() => axios.delete<Order>(`${this._ecommerceApi}/api/order/${orderId}`));
    }
}

export default OrdersService;

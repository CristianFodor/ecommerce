import axios from "axios";
import BaseService from "./BaseService";
import {Product} from "../entities/ProductEntity";
import {Order} from "../entities/OrderEntity";

export class ProductsService extends BaseService {
  private readonly _ecommerceApi: string;

  constructor(api: string) {
    super();
    this._ecommerceApi = api;
  }

  public async getProducts(filterCategory?: string): Promise<Product> {
    return this.doCall(() => axios.get<Product>(`${this._ecommerceApi}/api/product`, {params: {category: filterCategory}}));
  }
  public async createProduct(product: Product): Promise<Product>{
    return this.doCall(()=> axios.post<Product>(`${this._ecommerceApi}/api/product/create`, product));
  }
  public async deleteProduct(productId: string): Promise<Product> {
    return this.doCall(() => axios.delete<Product>(`${this._ecommerceApi}/api/product/${productId}`));
  }
}

export default ProductsService;

import axios from "axios";
import BaseService from "./BaseService";
import {Product} from "../entities/ProductEntity";

export class ProductsService extends BaseService {
  private readonly _ecommerceApi: string;

  constructor(api: string) {
    super();
    this._ecommerceApi = api;
  }

  public async getProducts(filterCategory?: string): Promise<Product> {
    return this.doCall(() => axios.get<Product>(`${this._ecommerceApi}/api/product`, {params: {category: filterCategory}}));
  }
}

export default ProductsService;

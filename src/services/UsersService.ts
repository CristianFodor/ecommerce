import axios from "axios";
import BaseService from "./BaseService";
import {User} from "./UserType";

export class UsersService extends BaseService {
  private readonly _api: string;

  constructor(api: string) {
    super();
    this._api = api;
  }

  public async checkUser(publicAddress: string): Promise<User> {
    return this.doCall(() => axios.post<User>(`${this._api}/user`, { publicAddress }));
  }
}

export default UsersService;

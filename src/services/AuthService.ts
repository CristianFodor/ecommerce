import BaseService from "./BaseService";
import {User} from "./UserType";

export class AuthService extends BaseService {
  private readonly _api: string;

  constructor(api: string) {
    super();
    this._api = api;
  }

  public checkUserRole(role: string, user: User): boolean {
    return user.roles.includes(role);
  }

  public isAdmin(user: User): boolean {
    return this.checkUserRole("admin", user);
  }
}

export default AuthService;

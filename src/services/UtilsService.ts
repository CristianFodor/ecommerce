import BaseService from "./BaseService";
import axios from "axios";

export class UtilsService extends BaseService {
    private readonly _api: string;

    constructor(api: string) {
        super();
        this._api = api;
    }

    public async getPrice() {
        const object = await axios.get(`https://maiartokens.com/token-value?fsym=EGLD&tsym=USDC`);
        return object.data.value;
    }
}

export default UtilsService;



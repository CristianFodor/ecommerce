import BaseService from "./BaseService";

export class UtilsService extends BaseService {
    private readonly _api: string;

    constructor(api: string) {
        super();
        this._api = api;
    }

    //@TODO Get EGLD PRICE (value object property)
    // 'https://maiartokens.com/token-value?fsym=EGLD&tsym=USDC
}

export default UtilsService;



import { Api } from "./base/api";
import { API_ENDPOINTS } from "../utils/constants";
import { IProduct } from "../types";
import { ApiGetResponse } from "../types";
import { IOrder } from "../types";
import { OrderResult } from "../types";
import { ApiOrderResponse } from "../types";
import { IShopAPI } from "../types";

export class ShopApi extends Api implements IShopAPI{

getProducts(): Promise<IProduct[]> {
    return this.get<ApiGetResponse<IProduct>>(API_ENDPOINTS.PRODUCTS).then(response=> response.items);
}

createOrder(order: IOrder): Promise<OrderResult> {
    return this.post<ApiOrderResponse<string>>(API_ENDPOINTS.ORDER, order)
}

}
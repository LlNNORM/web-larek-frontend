import { Api } from "./base/api";
import { API_ENDPOINTS } from "../utils/constants";
import { Item } from "../types/components/base/shopApi";
import { ApiItemsResponse } from "../types/components/base/shopApi";
import { Order } from "../types/components/base/shopApi";
import { OrderResult } from "../types/components/base/shopApi";
import { ApiOrderResponse } from "../types/components/base/shopApi";
import { IShopAPI } from "../types/components/base/shopApi";

export class ShopApi extends Api implements IShopAPI{

getItems(): Promise<Item[]> {
    return this.get<ApiItemsResponse<Item>>(API_ENDPOINTS.PRODUCTS).then(response=> response.items);
}

createOrder(order: Order): Promise<OrderResult> {
    return this.post<ApiOrderResponse<string>>(API_ENDPOINTS.ORDER, order).then(response => ({
        id: response.id,
        total: response.total
    }));
}

}
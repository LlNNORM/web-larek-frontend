import { IEvents } from "./base/events";
import { IProduct, IProductsData} from "../types";

export class ProductsData implements IProductsData {
   protected _products: IProduct[];
   protected _previewId: string | null;
   protected events: IEvents;
   constructor(events: IEvents) {
    this.events = events;
    
    }
    set products(products:IProduct[]) {
        this._products = products;
        this.events.emit('products:changed');
    }

    get products () {
        return this._products;
    }

    getProduct(productId: string) {
        return this._products.find((item) => item.id === productId)
    }

    set previewId(productId: string | null) {
        if (!productId) {
            this._previewId = null;
            return;
        }
        const selectedProduct = this.getProduct(productId);
        if (selectedProduct) {
            this._previewId = productId;
            this.events.emit('previewId:changed', { previewId: this.previewId })
        }
    }

    get previewId() {
        return  this._previewId;
    }
}
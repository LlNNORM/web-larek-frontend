import { IEvents } from "./base/events";
import { IProduct, IProductsData } from "../types";
// import { constraintsCard } from "../utils/constants";


export class ProductsData implements IProductsData {
   protected _products: IProduct[];
   protected _preview: string | null;
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

    set preview(productId: string | null) {
        if (!productId) {
            this._preview = null;
            return;
        }
        const selectedProduct = this.getProduct(productId);
        if (selectedProduct) {
            this._preview = productId;
            this.events.emit('preview:changed', { preview: this.preview })
        }
    }

    get preview() {
        return  this._preview;
    }
}
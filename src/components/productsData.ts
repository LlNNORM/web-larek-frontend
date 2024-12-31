import { IEvents } from "./base/events";
import { IProduct, IProductsData } from "../types";


type TBasketProductInfo = Pick<IProduct, 'title'|'price'>;

export class ProductsData implements IProductsData {
   protected _products: IProduct[];
   protected _basketProducts: TBasketProductInfo[];
   protected _preview: string | null;
   protected events: IEvents;
   constructor(events: IEvents) {
    this.events = events;
    this._basketProducts=[];
    }
    set products(products:IProduct[]) {
        this._products = products;
        this.events.emit('products:changed');
    }

    get products () {
        return this._products;
    }

    getProduct(productId: string | null) {
        return this._products.find((item) => item.id === productId)
    }

    getBasketProducts() {
       return this._basketProducts
    }

    getBasketTotal () {
        let total=0;
        if (this._basketProducts.length) {
            this._basketProducts.forEach(item=> total+=item.price)
            return total;
        }

    }

    set basketProducts(productId: string | null) {
        if (productId) {
            const {title, price} = this.getProduct(productId);
            console.log({title, price})
            this._basketProducts = [...this._basketProducts, {title, price}]
        }
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
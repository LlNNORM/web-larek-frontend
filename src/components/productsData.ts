import { IEvents } from "./base/events";
import { IProduct, IProductsData, TBasketProductInfo } from "../types";

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

    getProduct(productId: string) {
        return this._products.find((item) => item.id === productId)
    }

    getBasketProducts() {
       return this._basketProducts
    }

    deleteBasketProduct(productId: string) {
        this._basketProducts=this._basketProducts.filter(item => item.id!==productId)
        console.log(this._basketProducts)
        this.events.emit('basket:changed')
        
    }

    getOrderButtonState (productId: string) {
        if (this.getBasketProducts().some(item => item.id === productId)) return true
    }

    getBasketTotal () {
        let total=0;
        if (this._basketProducts.length) {
            this._basketProducts.forEach(item=> total+=item.price)
            return total;
        }

    }

    clearBasket () {
        this._basketProducts = []
    }

    set basketProducts(productId: string | null) {
        if (productId) {
            const {id, title, price} = this.getProduct(productId);
            console.log({id, title, price})
            this._basketProducts = [...this._basketProducts, {id, title, price}]
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
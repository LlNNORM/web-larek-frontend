import { IOrderForm, IOrder } from "../types";
import { IEvents } from "./base/events";
import { TBasketProductInfo } from "../types";
import { IOrderData } from "../types";


export type FormErrors = Partial<Record<keyof IOrder, string>>;

export class OrderData implements IOrderData {
    protected _payment: string;
    protected _address: string;
    protected _email: string;
    protected _phone: string ;
    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0
    };
    protected _counter: number;
    protected _basketProducts: TBasketProductInfo[];
    formErrors: FormErrors = {};
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._basketProducts=[];
        this._counter=0;
        }

    set basketProducts(basketProduct: TBasketProductInfo) {
        if (basketProduct) {
            this._basketProducts = [...this._basketProducts, basketProduct];
            this.order['items'] = [...this.order['items'], basketProduct.id];
        }
    }

    set counter (counter: number) {
        this._counter = counter;
    }

    get counter () {
        return this._counter
    }

    set payment (payment: string) {
        this._payment = payment;
    }

    set address (address: string) {
        this._address = address;
    }

    set email (email: string) {
        this._email = email;
    }

    set phone (phone: string) {
        this._phone = phone;
    }

    increaseBasketCounter () {
        return ++this._counter 
    }

    decreaseBasketCounter () {
        return --this._counter 
    }

    getBasketProducts() {
        return this._basketProducts
     }

    deleteBasketProduct(productId: string) {
        this._basketProducts=this._basketProducts.filter(item => item.id!==productId);
        this.order['items'] = this.order['items'].filter(item => item!==productId);
        console.log(this._basketProducts)
        this.events.emit('basket:changed')
        
    }

    getBasketTotal () {
        let total=0;
        if (this._basketProducts.length) {
            this._basketProducts.forEach(item=> total+=item.price)
            this.order['total'] = total;
            return total;
        }
    }

    clearBasket () {
        this._basketProducts = [];
        this.order['items'] =[];
    }

    getOrderButtonState (productId: string) {
        if (this.getBasketProducts().some(item => item.id === productId)) return true
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        console.log(this.order)
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:changed', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
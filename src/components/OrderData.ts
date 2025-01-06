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
    order: IOrder;
    protected _basketProducts: TBasketProductInfo[]=[];
    _formErrors: FormErrors;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._basketProducts=[];
        this.order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            items: [],
            total: 0
        }
        this._formErrors = {};
        }

    set basketProducts(basketProducts: TBasketProductInfo[]) {
        this._basketProducts = basketProducts;
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

    get orderPayment () {
        return this.order.payment
    }

    get orderAddress () {
        return this.order.address
    }

    get orderEmail () {
        return this.order.email
    }

    get orderPhone () {
        return this.order.phone
    }

    get formErrors() {
        return this._formErrors
    }

    getBasketProducts() {
        return this._basketProducts
     }

    deleteBasketProduct(productId: string) {
        this._basketProducts=this._basketProducts.filter(item => item.id!==productId);
        this.order['items'] = this.order['items'].filter(item => item!==productId);
        console.log(this._basketProducts)
        this.events.emit('basket:changed',{basketProducts:this._basketProducts??[]})
    }

    addBasketProduct(basketProduct: TBasketProductInfo) {
        this._basketProducts = [...this._basketProducts, basketProduct];
        this.order['items'] = [...this.order['items'], basketProduct.id];
        console.log(this._basketProducts)
        this.events.emit('basket:changed',{basketProducts:this._basketProducts??[]})
    }

    getBasketTotal () {
        return this._basketProducts.reduce((sum, item) => sum + item.price, 0);
    }

    setOrderTotal(total:number){
        this.order['total'] = total
    }

    clearBasket () {
        this._basketProducts = [];
        this.order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            items: [],
            total: 0
        }
        this.events.emit('basket:changed',{basketProducts:this._basketProducts??[]})
    }

    getOrderButtonState (productId: string) {
        return this.getBasketProducts().some(item => item.id === productId)
    }

    setOrderField(field: keyof IOrderForm, value: string, fieldsToValidate?: Array<keyof IOrderForm>) {
        this.order[field] = value;
        // По умолчанию валидируем только изменённое поле
        const fields = fieldsToValidate ?? [field];
        this.validateOrder(fields)

    }

    validateOrder(fieldsToValidate?: Array<keyof IOrderForm>) {
        console.log(this.order)
         // Создаём копию текущих ошибок
        const errors = { ...this._formErrors };
         // Определяем, какие поля валидировать. Если не пришел массив валидируемых полей, то валидируем все поля заказа
        const fields = fieldsToValidate ?? Object.keys(this.order) as Array<keyof IOrderForm>;

         // Если поле невалидно, то добавляем для него ошибку
        fields.forEach(field => {
            if (!this.order[field]) {
                switch (field) {
                    case 'payment':
                        errors.payment = 'Необходимо указать способ оплаты';
                        break;
                    case 'address':
                        errors.address = 'Необходимо указать адрес';
                        break;
                    case 'email':
                        errors.email = 'Необходимо указать email';
                        break;
                    case 'phone':
                        errors.phone = 'Необходимо указать телефон';
                        break;
                }
            } else {
                // Если поле валидно, удаляем ошибку
                delete errors[field];
            }
        });

        this._formErrors = errors;
        this._formErrors = errors;
        this.events.emit('formErrors:changed', this._formErrors);
    }
}
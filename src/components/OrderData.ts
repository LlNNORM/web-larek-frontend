import { IOrderForm, IOrder } from "../types";
import { IOrderData } from "../types";
import { IEvents } from "./base/events";

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
        items: ['c101ab44-ed99-4a54-990d-47aa2bb4e7d9'],
        total: 1450
    };
    formErrors: FormErrors = {};
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
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
    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        console.log(value);
        console.log(this.order)
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
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
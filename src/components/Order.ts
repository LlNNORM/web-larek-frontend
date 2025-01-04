import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";

export class Order extends Form<IOrderForm> {
    protected _payment:string;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        console.log(this.container.elements);
    }

    set payment(selectedPayment: string) {
        this.onPaymentToggle(selectedPayment);
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}
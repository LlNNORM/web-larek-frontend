import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected paymentButtons?:NodeListOf<HTMLButtonElement>;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        // Найти все кнопки с методами оплаты
        this.paymentButtons =  this.container.querySelectorAll('.order__buttons button');

        if (this.paymentButtons) {
            this.paymentButtons.forEach((button) => {
                button.addEventListener('click', (e: MouseEvent) => {
                    const target = e.target as HTMLButtonElement;
                    const field = 'payment' as keyof T;
                    const value = target.name;
                    this.onInputChange(field, value);
                });
            });
        };

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
            console.log('submit')
        });
    }
    
    protected onPaymentToggle(selectedPayment: string) {
        this.paymentButtons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === selectedPayment);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:changed`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}
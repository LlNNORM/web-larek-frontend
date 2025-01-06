import {Component} from "../base/Component";
import {createElement, ensureElement, formatBasketTotal} from "../../utils/utils";
import {IEvents} from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected confirmButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this.confirmButton = this.container.querySelector('.basket__button');

        if (this.confirmButton) {
            this.confirmButton.addEventListener('click', () => {
                events.emit('order:open');
            });
        }


        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this.confirmButton, false);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this.confirmButton, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, formatBasketTotal(total));
    }
}
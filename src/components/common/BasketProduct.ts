import { Product } from "../Product";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

export interface IBasketProduct {
    title:string;
    price:number;
    index:number;
}

// interface ICardActions {
//     onClick: (event: MouseEvent) => void;
// }

export class BasketProduct extends Product<IBasketProduct> {
    protected _index: HTMLElement;
    protected deleteButton:HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this.deleteButton = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);

    }

    set index(index:number) {
        this._index.textContent=String(index+1);
    }
}
import {ensureElement} from "../../utils/utils";
import { Product } from "../Product";
import { IProduct } from "../../types";
import { formatNumber } from "../../utils/utils";

type TProductInfo = {
    id:string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number|null;
    buttonState:boolean;
}

interface IPreviewActions {
    onClick: () => void;
}

export class Preview extends Product<TProductInfo> {
    protected addToBasketButton: HTMLElement;
    protected productDescription: HTMLElement;

    constructor(container: HTMLElement, actions: IPreviewActions) {
        super(container);

        this.addToBasketButton = ensureElement<HTMLElement>('.button', this.container);
        this.productDescription = this.container.querySelector('.card__text');
        this.removeClickListener();
        if (actions?.onClick) {
            this.addToBasketButton.addEventListener('click', actions.onClick);
        }
    }

    set buttonState (changed:boolean) {
        this.addToBasketButton.textContent = changed ? 'Удалить из корзины' : 'В корзину'
    }

    set price(price:number|null) {
        if (!price) this.setDisabled(this.addToBasketButton, true)
            else {
                this.productPrice.textContent = formatNumber(price);
                this.setDisabled(this.addToBasketButton, false);
        }
        this.productPrice.textContent = formatNumber(price);
    }

    set description(description:string) {
        this.productDescription.textContent = description;
    }

}
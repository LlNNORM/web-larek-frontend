import {ensureElement} from "../../utils/utils";
import { Product } from "../Product";
import { IProduct } from "../../types";
import { formatNumber } from "../../utils/utils";

type TProductInfo = Pick<IProduct, 'description'|'image'|'title'|'category'|'price'>;

interface IPreviewActions {
    onClick: () => void;
}

export class Preview extends Product<TProductInfo> {
    protected addToBasketButton: HTMLElement;
    protected productDescription: HTMLElement;
    protected productPrice:HTMLDivElement;

    constructor(container: HTMLElement, actions: IPreviewActions) {
        super(container);

        this.addToBasketButton = ensureElement<HTMLElement>('.button', this.container);
        this.productDescription = this.container.querySelector('.card__text');
        this.removeClickListener();
        if (actions?.onClick) {
            this.addToBasketButton.addEventListener('click', actions.onClick);
        }
    }

    set price(price:number) {
        if (!price) this.setDisabled(this.addToBasketButton, true)
            else {
                this.productPrice.textContent = formatNumber(price);
                this.setDisabled(this.addToBasketButton, false);
        }

    }

    set description(description:string) {
        this.productDescription.textContent = description;
    }

}
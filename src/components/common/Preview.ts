import {ensureElement} from "../../utils/utils";
import { Product } from "../Product";
import { IProduct } from "../../types";

type TProductInfo = Pick<IProduct, 'description'|'image'|'title'|'category'|'price'>;

interface IPreviewActions {
    onClick: () => void;
}

export class Preview extends Product<TProductInfo> {
    protected orderProduct: HTMLElement;
    protected productDescription: HTMLElement;

    constructor(container: HTMLElement, actions: IPreviewActions) {
        super(container);

        this.orderProduct = ensureElement<HTMLElement>('.button', this.container);
        this.productDescription = this.container.querySelector('.card__text');
        this.removeClickListener();
        if (actions?.onClick) {
            this.orderProduct.addEventListener('click', actions.onClick);
        }
    }

    set description(description:string) {
        this.productDescription.textContent = description;
    }

}
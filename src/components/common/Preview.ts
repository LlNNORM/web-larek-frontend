import {ensureElement} from "../../utils/utils";
import { Product } from "../Product";


interface IPreviewActions {
    onClick: () => void;
}

export class Preview extends Product {
    protected close: HTMLElement;
    protected productDescription: HTMLElement;

    constructor(container: HTMLElement, actions: IPreviewActions) {
        super(container);

        this.close = ensureElement<HTMLElement>('.button', this.container);
        this.productDescription = this.container.querySelector('.card__text');
        this.removeClickListener();
        if (actions?.onClick) {
            this.close.addEventListener('click', actions.onClick);
        }
    }

    set description(description:string) {
        this.productDescription.textContent = description;
    }

}
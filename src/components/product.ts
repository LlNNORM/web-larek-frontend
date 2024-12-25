import { IProduct } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { CDN_URL } from '../utils/constants';

export class Product {
	protected element: HTMLElement;
	protected events: IEvents;
    protected productCategory: HTMLElement;
    protected productTitle: HTMLElement;
	protected productImage: HTMLImageElement;
    protected productPrice: HTMLDivElement;
	protected productId: string;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(template);
        this.productCategory = this.element.querySelector('.card__category');
        this.productTitle = this.element.querySelector('.card__title');
		this.productImage = this.element.querySelector('.card__image');
        this.productPrice = this.element.querySelector('.card__price');

		this.element.addEventListener('click', () =>
			this.events.emit('card:select', { card: this })
		);
	}
    render(productData:Partial<IProduct>|undefined) {
        Object.assign(this, productData)
		return this.element;
	}

    set price(price:string) {
        this.productPrice.textContent = String(price);
    }

    set image(image:string) {
        this.productImage.src = CDN_URL + image;
    }

    set title(title:string) {
        this.productTitle.textContent = title;
    }

    set category(category:string) {
        this.productCategory.textContent = category;
    }


    set id(id:string) {
        this.productId = id;
    }

	get id() {
		return this.productId;
	}

	
}

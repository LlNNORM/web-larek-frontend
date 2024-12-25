import { IProduct } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { CDN_URL } from '../utils/constants';

export class Product extends Component<IProduct> {
	protected events: IEvents;
    protected productCategory: HTMLElement;
    protected productTitle: HTMLElement;
	protected productImage: HTMLImageElement;
    protected productPrice: HTMLDivElement;
	protected productId: string;

	constructor(protected container: HTMLElement, events: IEvents) {
        super(container)
		this.events = events;
        this.productCategory = this.container.querySelector('.card__category');
        this.productTitle = this.container.querySelector('.card__title');
		this.productImage = this.container.querySelector('.card__image');
        this.productPrice = this.container.querySelector('.card__price');

		this.container.addEventListener('click', () =>
			this.events.emit('product:selected', { product: this })
		);
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

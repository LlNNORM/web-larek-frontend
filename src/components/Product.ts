import { Component } from './base/Component';
import { IEvents } from './base/events';
import { CDN_URL } from '../utils/constants';
import { formatNumber } from '../utils/utils';

export class Product<T> extends Component<T> {
	protected events: IEvents;
    protected productCategory: HTMLElement;
    protected productTitle: HTMLElement;
	protected productImage: HTMLImageElement;
    protected productPrice: HTMLDivElement;
	protected productId: string;
    private clickHandler: () => void;

	constructor(protected container: HTMLElement, events?: IEvents) {
        super(container)
		this.events = events;
        this.productCategory = this.container.querySelector('.card__category');
        this.productTitle = this.container.querySelector('.card__title');
		this.productImage = this.container.querySelector('.card__image');
        this.productPrice = this.container.querySelector('.card__price');
        this.clickHandler = this.onClick(events);
		this.container.addEventListener('click', this.clickHandler);
	}

    protected onClick = (events?: IEvents)=>()=>{
        events.emit('product:selected', { productId: this.productId })
    }

    protected removeClickListener() {
        this.container.removeEventListener('click', this.clickHandler);
    }

    set price(price:number) {
        this.productPrice.textContent = formatNumber(price);
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


import './scss/styles.scss';
import { ShopApi } from './components/ShopApi';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductsData } from './components/ProductsData';
import { Product } from './components/Product';
import { ProductsContainer } from './components/ProductsContainer';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { Preview } from './components/common/Preview';
import { ensureElement } from './utils/utils';
// import { UserData } from './components/userData';

const events: IEvents = new EventEmitter();
const productsData = new ProductsData(events);
// const userData = new UserData(events);

const api = new ShopApi(API_URL);
const gallery = document.querySelector('.gallery') as HTMLElement;
const itemTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const productsContainer = new ProductsContainer(gallery);
const modalContainer = document.querySelector('#modal-container') as HTMLElement
const modal = new Modal(modalContainer, events);
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

api
	.getProducts()
	.then((items) => {
		productsData.products = items;
	})
	.catch((err) => console.log(err));

events.on('products:changed', () => {
	const productsHTMLList = productsData.products.map((product) => {
		const productInstant = new Product(cloneTemplate(itemTemplate), events);
		return productInstant.render(product);
	});
	productsContainer.render({ catalog: productsHTMLList });
});

events.on('product:selected', ({productId}:{ productId: string }) => {
  productsData.preview = productId;
  console.log(productId);
});

events.on('preview:changed', ({preview}:{ preview: string })=> {
	// console.log(productsData.getProduct(preview))
	// const productInstant = new Product(cloneTemplate(itemTemplate), events);
	// console.log(productInstant.render(productsData.getProduct(preview)))
	// modal.render({content:productInstant.render(productsData.getProduct(preview))})
	// const success = new Success(cloneTemplate(successTemplate), {
	// 	onClick: () => {
	// 		modal.close();
	// 		// appData.clearBasket();
	// 		// events.emit('auction:changed');
	// 	}
	// });
	// modal.render({
	// 	content: success.render({total:50})
	// });

	const productPreview = new Preview(cloneTemplate(previewTemplate), {
		onClick: () => {
			modal.close();
			// appData.clearBasket();
			// events.emit('auction:changed');
		}
	});
	modal.render({
		content: productPreview.render(productsData.getProduct(preview))
	});
})

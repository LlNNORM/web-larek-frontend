import './scss/styles.scss';
import { ShopApi } from './components/ShopApi';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductsData } from './components/ProductsData';
import { Product } from './components/Product';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { Preview } from './components/common/Preview';
import { ensureElement } from './utils/utils';
import { IProduct } from './types';
import { Page } from './components/Page';
// import { UserData } from './components/userData';

const events: IEvents = new EventEmitter();
const api = new ShopApi(API_URL);

// Темплейты
const productTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const page = new Page(document.body, events);

const productsData = new ProductsData(events);
// const userData = new UserData(events);


const modalContainer = document.querySelector('#modal-container') as HTMLElement
const modal = new Modal(modalContainer, events);



api
	.getProducts()
	.then((items) => {
		productsData.products = items;
	})
	.catch((err) => console.log(err));

events.on('products:changed', () => {
	const productsHTMLList = productsData.products.map((product) => {
		const productInstant = new Product<IProduct>(cloneTemplate(productTemplate), events);
		return productInstant.render(product);
	});
	page.render({ catalog: productsHTMLList });
});

events.on('basket:open',()=> {
	
})

events.on('product:selected', ({productId}:{ productId: string }) => {
  productsData.preview = productId;
  console.log(productId);
});

events.on('preview:changed', ({preview}:{ preview: string })=> {
	// console.log(productsData.getProduct(preview))
	// const productInstant = new Product(cloneTemplate(productTemplate), events);
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

'basket:open'
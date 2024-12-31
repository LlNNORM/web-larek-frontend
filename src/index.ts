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
import { Basket } from './components/common/Basket';
import { BasketProduct } from './components/common/BasketProduct';
// import { UserData } from './components/userData';

const events: IEvents = new EventEmitter();
const api = new ShopApi(API_URL);

// Темплейты
const productTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketProductTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
// Контейнеры
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Модели данных приложения
const productsData = new ProductsData(events);
// const userData = new UserData(events);

// Переиспользуемые части интерфейса
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);






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

// events.on('basket:open',()=> {
// 	const basket = new Basket(cloneTemplate(basketTemplate), events);
// 	modal.render({
// 		content: basket.render(productsData.getProduct(preview))
// 	});
// })

events.on('product:selected', ({productId}:{ productId: string }) => {
  productsData.preview = productId;
  console.log(productId);
});

events.on('preview:changed', ({preview}:{ preview: string })=> {
	const productPreview = new Preview(cloneTemplate(previewTemplate), {
		onClick: () => {
			modal.close();
			productsData.basketProducts = preview;
			console.log(productsData.getBasketProducts())

			// appData.clearBasket();
			// events.emit('auction:changed');
		}
	});
	modal.render({
		content: productPreview.render(productsData.getProduct(preview))
	});

	// const basketProduct = new BasketProduct(cloneTemplate(basketProductTemplate),events);
	// console.log(basketProduct.render({price:12, title: 'лох', index:1}))
	// modal.render({
	// 		content: basketProduct.render({price:12, title: 'лох', index:1})
	// 	});
	// 	productsData.basketProducts = preview;
	// 	productsData.getBasketProducts();
	// basket.items = productsData.getBasketProducts().map(item => {
	// 	const basketProduct = new BasketProduct(cloneTemplate(basketProductTemplate),events);
	// 	return basketProduct.render({price:12, title: 'лох', index:1});
	// })
	// basket.total = 50;
	// console.log(basket.items)

	// modal.render({
	// 	content: basket.render()
	// });

})

events.on('basket:open',()=> {
	basket.items = productsData.getBasketProducts().map((item,index) => {
			const basketProduct = new BasketProduct(cloneTemplate(basketProductTemplate),events);
			return basketProduct.render({...item,index});
		})
		basket.total = productsData.getBasketTotal();
		console.log(basket.items)
	
		modal.render({
			content: basket.render()
		});
})

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
import './scss/styles.scss';
import { ShopApi } from './components/shopApi';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductsData } from './components/productsData';
import { Product } from './components/product';
import { ProductsContainer } from './components/productsContainer';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
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
	const success = new Success(cloneTemplate(successTemplate), {
		onClick: () => {
			modal.close();
			// appData.clearBasket();
			// events.emit('auction:changed');
		}
	});
	modal.render({
		content: success.render({total:50})
	});
})

// events.on('order:submit', () => {
//     api.orderLots(appData.order)
//         .then((result) => {
//             const success = new Success(cloneTemplate(successTemplate), {
//                 onClick: () => {
//                     modal.close();
//                     appData.clearBasket();
//                     events.emit('auction:changed');
//                 }
//             });

//             modal.render({
//                 content: success.render({})
//             });
//         })
//         .catch(err => {
//             console.error(err);
//         });
// });






// const products = items.map(item=> product.render(item));
//   console.log(products)
//   productsContainer.render({catalog:products})

// interface IBasketModel {
//   items: Map<string, number>;
//   add(id:string):void;
//   remove(id:string):void;
// }

// interface IEventEmitter {
//   emit: (event:string, data:unknown) => void;
// }

// class BasketModel implements IBasketModel {
//   items:Map<string, number> = new Map();
//   constructor (protected events:IEventEmitter) {}
//   add (id:string):void {
//     if (!this.items.has(id)) this.items.set(id, 0); // создаем новый
//     this.items.set(id, this.items.get(id)! +1); // прибавляем количество
//     this._changed();
//   }
//   remove (id:string):void {
//     if (!this.items.has(id)) return; // если нет, то ничего не делаем
//     if (this.items.get(id)!>0) { // если есть и больше ноля, то
//       this.items.set(id, this.items.get(id)!-1) // уменьшаем
//       if (this.items.get(id)===0) this.items.delete(id); // если уменьшили до нуля, то удаляем
//       this._changed();
//     }
//   }

//   protected _changed() { // метод, генерирующий уведомление об изменении
//     this.events.emit('basket:change', {items: Array.from(this.items.keys())})
//   }
// }

// const events = new EventEmitter();
// const basket = new BasketModel(events);
// events.on ('basket:change', (data:{items:string[]})=> {

// });

// interface IProduct {
//   id:string;
//   title:string;
// }

// interface CatalogModel {
//   items: IProduct[];
//   setItems(items:IProduct[]):void; //чтобы установить после загрузки из апи
//   getProduct(id:string):IProduct; // чтобы получить при рендере списков
// }

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
import { Order } from './components/Order';
import { ensureElement } from './utils/utils';
import { IProduct } from './types';
import { Page } from './components/Page';
import { Basket } from './components/common/Basket';
import { BasketProduct } from './components/common/BasketProduct';
import { IOrderForm } from './types';
import { OrderData } from './components/OrderData';

const events = new EventEmitter();
const api = new ShopApi(API_URL);

// Темплейты
const productTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketProductTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const detailsTemplate = ensureElement<HTMLTemplateElement>('#details');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#order');

// Контейнеры
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Модели данных приложения
const productsData = new ProductsData(events);
const orderData = new OrderData(events);

// Переиспользуемые части интерфейса
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);
const detailsForm = new Order(cloneTemplate(detailsTemplate),events);
const contactsForm = new Order(cloneTemplate(contactsTemplate),events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);


events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})



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


events.on('product:selected', ({productId}:{ productId: string }) => {
  productsData.preview = productId;
});

events.on('preview:changed', ({preview}:{ preview: string })=> {
	const productPreview = new Preview(cloneTemplate(previewTemplate), {
		onClick: () => {
			modal.close();
			if (orderData.getBasketProducts().some(item => item.id === preview)) {
				orderData.deleteBasketProduct(preview);
				page.render({ counter: orderData.decreaseBasketCounter() })
			} else {
				const {id, title, price} = productsData.getProduct(preview);
				const basketProduct = {id, title, price};
				orderData.basketProducts = basketProduct;
				page.render({ counter: orderData.increaseBasketCounter() });
			}
		}
	});
	modal.render({
		content: productPreview.render({...productsData.getProduct(preview), buttonState: orderData.getOrderButtonState(preview)})
	});

})

events.on('basket:open',()=> {
	basket.items = orderData.getBasketProducts().map((item,index) => {
			const basketProduct = new BasketProduct(cloneTemplate(basketProductTemplate),events);
			return basketProduct.render({...item,index});
		})
		basket.total = orderData.getBasketTotal();
		modal.render({
			content: basket.render()
		});
})

events.on('product:delete', ({productId}:{ productId: string }) => {
	orderData.deleteBasketProduct(productId);
	basket.total = orderData.getBasketTotal();
	page.render({ counter: orderData.decreaseBasketCounter() })
  });

events.on('basket:changed', () => {
	basket.items = orderData.getBasketProducts().map((item,index) => {
		const basketProduct = new BasketProduct(cloneTemplate(basketProductTemplate),events);
		return basketProduct.render({...item,index});
	})
	basket.render()
  });
  

events.on('order:open',()=> {

		modal.render({
			content: detailsForm.render({
				payment:'',
				address:'',
				valid: false,
				errors: []
			})
		});
})

events.on('details:submit',()=> {
	modal.render({
		content: contactsForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: []
		})
	});

})

// Отправлена форма заказа
events.on('order:submit', () => {
    api.createOrder(orderData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
					
                }
            });
			orderData.counter=0
			page.render({ counter: orderData.counter })
			orderData.clearBasket();
            modal.render({
                content: success.render({total:result.total})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Изменилось состояние валидации формы
events.on('formErrors:changed', (errors: Partial<IOrderForm>) => {
    const {payment, address, email, phone } = errors;
	detailsForm.valid = !payment&&!address;
	detailsForm.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^details|order\..*:changed/, (data: { field: keyof IOrderForm, value: string }) => {
	if (data) {
        orderData.setOrderField(data.field, data.value);
	    // Если поле — payment, обновляем состояние кнопок
		if (data.field === 'payment') {
			detailsForm.payment = data.value; // Устанавливаем активное состояние кнопок
		}
    }
    
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
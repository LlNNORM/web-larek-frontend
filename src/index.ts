import './scss/styles.scss';
//github не отследил измения названий файлов
import { ShopApi } from './components/ShopApi';
import { API_URL } from './utils/constants';
import { EventEmitter} from './components/base/events';
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
import { TBasketProductInfo } from './types';

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
  productsData.previewId = productId;
});

events.on('previewId:changed', ({previewId}:{ previewId: string })=> {
	const productForPreview = new Preview(cloneTemplate(previewTemplate), {
		onClick: () => {
			modal.close();
			if (orderData.getBasketProducts().some(item => item.id === previewId)) {
				orderData.deleteBasketProduct(previewId);
			} else {
				const {id, title, price} = productsData.getProduct(previewId);
				const newBasketProduct = {id, title, price};
				orderData.addBasketProduct(newBasketProduct);
			}
		}
	});
	modal.render({
		content: productForPreview.render({...productsData.getProduct(previewId), buttonState: orderData.getOrderButtonState(previewId)})
	});

})

events.on('basket:open',()=> {
	basket.items = orderData.getBasketProducts().map((item,index) => {
			const basketProduct = new BasketProduct(cloneTemplate(basketProductTemplate),events);
			return basketProduct.render({...item,index});
		})

		modal.render({
			content: basket.render()
		});
})

events.on('product:delete', ({productId}:{ productId: string }) => {
	orderData.deleteBasketProduct(productId);
  });

events.on('basket:changed', ({basketProducts}:{basketProducts:TBasketProductInfo[]}) => {
	basket.items = basketProducts.map((item,index) => {
		const basketProduct = new BasketProduct(cloneTemplate(basketProductTemplate),events);
		return basketProduct.render({...item,index});
	})
	const basketTotal = orderData.getBasketTotal();
	basket.total = basketTotal;
	page.render({ counter: basketProducts.length })
	orderData.setOrderTotal(basketTotal);
  });
  

events.on('order:open',()=> {
	const {payment, address} = orderData.formErrors;
		modal.render({
			content: detailsForm.render({
				payment:orderData.orderPayment,
				address:orderData.orderAddress,
				valid: !payment&&!address,
				//Фильтр необходим для того,чтобы избавиться от undefined, что может появиться при отсутсвии ошибки в orderData
				errors: [payment, address].filter(Boolean),
			})
		});
})

events.on('details:submit',()=> {
	const {email, phone } = orderData.formErrors;

	modal.render({
		content: contactsForm.render({
			phone:orderData.orderPhone,
			email:orderData.orderEmail,
			valid: !email && !phone,
			errors: [email, phone ].filter(Boolean),
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
events.on(/^details\..*:changed/, (data: { field: keyof IOrderForm, value: string }) => {
        orderData.setOrderField(data.field, data.value, ['payment', 'address']);
	    // Если поле — payment, обновляем состояние кнопок
		data.field === 'payment' ? detailsForm.payment = data.value : undefined; // Устанавливаем активное состояние кнопок
});

events.on(/^order\..*:changed/, (data: { field: keyof IOrderForm, value: string }) => {
        orderData.setOrderField(data.field, data.value, ['email', 'phone']);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
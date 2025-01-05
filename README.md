# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Проект "Веб-ларек" реализует пример типового сервиса для покупки товаров. Пользователь может просматривать каталог товаров, при клике на товар отрывать модальное окно с его полным описанием, также при помощи открывшегося модального окна добавлять товар в корзину, удалять его через данную форму,если он уже содержится в корзине, при оформлении заказа пользователь может выбрать способ оплаты, указать адрес, имейл и номер мобильного телефона. При нажатии на корзину открывается модальное окно корзины, с кратким описанием добавленных в нее товаров, товар также может быть удален из корзины. Проект реализован на TypeScript и представляет собой SPA (Single Page Application) с использованием API для получения данных о товарах.

## Данные и типы данных используемые в проекте

Продукт

```typescript
interface IProduct {
	id:string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number|null
}
```

Заказ. Данный интерфейс расширяет IOrderForm

```typescript
interface IOrder extends IOrderForm {
	items: Pick<IProduct, 'id'>[]; //список id товаров
	total:number; // стоимость заказа
}
```

API для получения продуктов и отправки заказа

```typescript
interface IShopAPI {
	getProducts: () => Promise<IProduct[]>;
	createOrder: (order: IOrder) => Promise<OrderResult>;
}
```
Интерфейс с дженериком для получения данных от API

```typescript
type ApiGetResponse<Type> = {
    total: number; // количество товаров 
	items: Type[]; //список товаров
};
```

Интерфейс с дженериком для отправки заказа через API, в таком формате придет ответ от сервера

```typescript
type ApiOrderResponse<Type> = {
    id: Type;       //id заказа
	total: number; // стоимость заказа
};
```

Интерфейс для данных, которые мы получим после обработки ответа от сервера. Здесь мы точно знаем с каким типом данных для id будем работать, таким образом не приходится тянуть дженерики в интерфейс IShopAPI

```typescript
interface OrderResult {
	id: string;
	total:number;
}
```

Интерфейс для модели данных продуктов

```typescript
interface IProductsData {
    products:IProduct[];
    preview:string|null; //сохранение id, выбранной для отображения карточки продукта
	getProduct(productId: string):IProduct;
}
```

Интерфейс для модели данных заказа

```typescript
interface IOrderData extends IOrderForm{
	order:IOrder;
	counter:number;
	increaseBasketCounter ():void;
	decreaseBasketCounter ():void;
	getBasketProducts():TBasketProductInfo[];
	deleteBasketProduct(productId: string):void;
	getBasketTotal ():number;
	clearBasket ():void;
	getOrderButtonState (productId: string):boolean;
	setOrderField(field: keyof IOrderForm, value: string):void;
	validateOrder():boolean;
}
```

Данные продукта, используемые в модальном окне отображения полной информации о продукте

```typescript
type TProductInfo = Pick<IProduct, 'description'|'image'|'title'|'category'|'price'>;
```

Данные продукта, используемые в модальном окне корзины

```typescript
type TBasketProductInfo = Pick<IProduct, 'id'|'title'|'price'>;
```

Данные, принимаемые с форм заказа

```typescript
interface IOrderForm {
	payment: string;
	address: string;
    email: string;
	phone: string;
}
```

Данные заказа, используемые в модальном окне успешной оплаты

```typescript
type TOrderCost= Pick<IOrder, 'total'>
```

## Архитектура проекта (MVP)
Код приложения разделен на слои согласно парадигме MVP:
- Cлой представления. Отвечает за отображение данных на странице.
- Cлой данных. Отвечает за хранение и изменение данных.
- Презентер. Отвечает за связь слоев представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и оgциональный объект с заголовками запросов.

Методы:
- `get` - выполняет GET запрос на переданный в параметрах endpoint и возвращает промис с объектом, являющимся ответом сервера.

- `post` - принимает объект с данными, которые будут переданы в JSON-формате в теле запроса, и отправляет эти данные на endpoint, переданный параметром при вызове метода. По умолчанию выполняется 'POST' запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.
Класс имеет методы on , off , emit — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.

Основные методы, реализуемые классом, описаны интерфейсом 'IEvents':
- `on` - подписка на событие.
- `emit` - инициализация события.
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

Дополнительно реализованы методы onAll и offAll — для подписки на все события и сброса всех подписчиков.
Метод trigger, генерирующий заданное событие с заданными аргументами интересен тем, что позволяет передавать сгенерированное событие в качестве обработчика события в другие классы. Эти классы будут генерировать события, не являясь при этом напрямую зависимыми от класса EventEmitter.

### Слой данных

#### Класс ProductsData
Класс отвечает за хранение и логику работы с данными товаров, пришедших с сервера. Имплементирует интерфейс IProductsData.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- _products: IProduct[] - массив объектов продуктов
- _preview: string | null - id карточки, выбранной для просмотра в модальной окне
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы:
- getProduct(productId: string): IProduct - возвращает карточку товара по ее id
- а также сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными текущего пользователя. Имплементирует интерфейс IUser.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- _payment: string - Метод оплаты
- _address: string - Адрес доставки
- _email: string - Адрес электронной почты пользователя
- _phone: string - Номер телефона пользователя
- order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0
    };
- _counter: number=0 - Счетчик товаров корзины.
- _basketProducts: TBasketProductInfo[]=[] - Список товаров корзины.
- formErrors: FormErrors = {} - Объект, содержащий ошибки валидации форм.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
Методы:
- checkValidation(data: Record<keyof IUser, string>): boolean - проверяет объект с данными пользователя на валидность
- increaseBasketCounter () - увеличение счетчика корзины
- decreaseBasketCounter () - уменьшение счетчика корзины
- getBasketProducts() - получение продуктов, находящихся в корзине
- deleteBasketProduct(productId: string) - удаление продукта из корзины
- getBasketTotal () - получение полной стоимости корзины
- clearBasket () - очистка корзины после успешного заказа
- getOrderButtonState (productId: string) - получение состояния кнопки, находящейся в превью. Если false, то надпись `В корзину`, а если true, то `Удалить из корзины`
- setOrderField(field: keyof IOrderForm, value: string) - устанавливает в модели данных полученные из форм значения полей заказа 
- validateOrder() - валидация заказа, создает событие 'order:ready', если все поля форм валидны
- а также сеттеры для сохранения данных полей класса

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый Класс Component
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клик в оверлей и кнопку-крестик для закрытия попапа. Данный класс отображает внутри себя любую разметку, которая передается в качестве контента в метод render. Такие классы, как Preview, Basket, Order, Success  генерируют свой контент для отображения в модальном окне.
- constructor(container: HTMLElement, protected events: IEvents) конструктор принимает в себя контейнер, в котором будет производиться рендер, и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- closeButton: HTMLButtonElement - кнопка закрытия модального окна
- _content: HTMLElement - контент отображаемый внутри модального окна

#### Класс Preview
Расширяет класс `Product`. Предназначен для генерации контента модального окна, содержащего полную информацию о товаре. Содержит сеттер `description` для задания описания товара и сеттеры для управления кнопкой,а именно для её отключения в случае бесценного товара и замены надписи с `В корзину` на `Удалить из корзины`, если товар уже находится в корзине и наоборот.

#### Класс Basket
Расширяет класс `Component`. Предназначен для генерации контента модального окна, содержащего краткую информацию о товаре, находящемся в корзине. Содержит сеттеры для задания содержимого корзины и итоговой стоимости заказа.

#### Класс BasketProduct
Расширяет класс `Product`. Предназначен для генерации списка товаров для отображения в корзине. Сгенерированный данным классом списов передается в контентную часть класса Basket. Содержит сеттер для задания индекса товара.

#### Класс Form
Расширяет класс `Component`, служит основой для класса Order.

Поля класса
- _submit: HTMLButtonElement - кнопка сабмита формы
- _errors: HTMLElement - поле ошибок валидации
- paymentButtons:NodeListOf<HTMLButtonElement> - кнопки выбора способа оплаты

Методы:
- onPaymentToggle(selectedPayment: string): void - для изменения активной кнопки выбора платежа
- onInputChange(field: keyof T, value: string): void - для генерации события изменения поля ввода или состояния кнопки выбора оплаты
- а также сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс Order
Расширяет класс `Form`. Предназначен для генерации контента форм заказа. Содержит сеттеры для задания способа оплаты, адреса, имейла и номера телефона.

#### Класс Success
Расширяет класс `Component`. Предназначен для генерации контента модального окна, содержащего информацию об успешной покупке и стоимости заказа. Содержит сеттер для задания стоимости заказа. 

#### Класс Product
Расширяет класс `Component`.Отвечает за отображение карточки товара, задавая в ней данные категорию, название, изображение и цену товара. Класс используется для отображения карточек товаров на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливается слушатель события 'click' на карточку, в результате срабатывания которого происходит открытие модального окна с подробной информацией о товаре.\
В качестве колбэка в слушатель передается ссылка на метод `onClick(events)`, который выносится отдельным методом класса, делается это для того, чтобы потом была возможность удалить данный слушатель у потомков класса. Для удаления слушателя события предусмотрен метод `removeClickListener`.\
Поля класса содержат элементы разметки элементов карточки товара. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Метод `onClick` идет c двойным вызовом, для создания замыкания на объекте `events`.
Когда вызывается onClick, передается объект events, и onClick возвращает анонимную функцию, которая в свою очередь вызывает метод emit на объекте events. Так как возвращаемая методом функция является анонимной, то для того, чтобы иметь в дальнейшем возможность удалить слушатель события 'click', мы передаем в него не саму функцию `onClick(events)`, а переменную clickHandler, содержащую результат её вызова.\
Данный класс использует render(ProductData: Partial<IProduct>): HTMLElement родительского класса `Component`, с его помощью происходит заполнение атрибутов элементов карточки данными. Метод возвращает разметку карточки с установленным слушателем события 'click'. Слушатель устанавливается на всю карточку, событие генерируется через экземпляр брокера событий. Кроме того, используются сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс Page
Отвечает за отображение блока с карточками товаров на главной странице, счётчика корзины и за блокировку и разблокировку страницы при открытии и закрытии модального окна соответственно. Предоставляет сеттер `catalog` для полного обновления содержимого блока с карточками товаров, а также  сеттеры `counter` для задания счётчика корзины и `locked` для блокировки и разблокировки страницы.

### Слой коммуникации

#### Класс ShopApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

Пример работы, используемого событийно-ориентированного подхода:
1. Пользователь  нажал на карточку товара
2. Класс отображения Product реагирует на действие пользователя и генерирует событие 'product:selected'.
3. Презентер обрабатывает данное событие и вызывает сеттер preview класса модели данных ProductsData 
4. В модели данных в свойстве preview сохраняется id карточки, на которую был совершен клик пользователя и генерируется событие 'preview:changed'
4. Презентер обрабатывает данное событие и вызывает рендер класса отображения Modal, в который в качестве контента передается результат рендера класса отображения Preview. Класс Preview при этом в качестве аргументов для рендера принимает описание выбранного товара, переданное от модели данных ProductsData.
5. Открывается модальное окно с информацией, соответствующей выбранному товару. За открытие модального окна отвечает вызов метода open внутри рендера класса Modal

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `products:changed` - изменение массива карточек товаров
- `preview:changed` - изменение id, выбранной карточки в модели данных
- `basket:changed` - изменение содержимого корзины, срабатывает при удалении карточки из корзины
- `formErrors:changed` - изменение объекта, содержащего ошибки валидации формы
- `order:ready` - успешная валидация обеих форм заказа

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `product:selected` - изменение открываемой в модальном окне картинки карточки
- `basket:open` - открытие модального окна с корзиной
- `product:delete` - удаление товара из корзины при нажатии на иконку корзины или на кнопку `Удалить из корзины` в модальном окне с превью
- `order:open` - открытие модального окна с формой выбора оплаты и адресом
- `details:submit` - сабмит формы с выбором оплаты и адресом
- `order:submit` - отправка заказа на сервер
- `details.payment:changed` - изменение метода оплаты
- `details.address:changed` - изменение состояния ипута для адреса
- `order.email:changed` - изменение состояния ипута для адреса электронной почты
- `order.phone:changed` - изменение состояния ипута для номера мобильного телефона
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна





































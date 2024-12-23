export type ApiOrderResponse<Type> = {
    id: Type;       //id заказа
	total: number; // стоимость заказа
};

export type ApiItemsResponse<Type> = {
    total: number; // количество товаров 
	items: Type[]; //список товаров
};

export interface Item {
	id:string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number|null
}

export interface Details {
	payment: string;
	address: string;
}

export interface Contacts {
	email: string;
	phone: string;
}

export interface Order extends Details, Contacts {
	items: string[]; //список id товаров
	total:number; // стоимость заказа
}

export interface OrderResult {
	id: string;
	total:number;
}

export interface IShopAPI {
	getItems: () => Promise<Item[]>;
	createOrder: (order: Order) => Promise<OrderResult>;
}

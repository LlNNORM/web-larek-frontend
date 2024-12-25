export type ApiOrderResponse<Type> = {
    id: Type;       //id заказа
	total: number; // стоимость заказа
};

export type ApiGetResponse<Type> = {
    total: number; // количество товаров 
	items: Type[]; //список товаров
};

export interface IProduct {
	id:string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number|null;
}

export interface IProductsData {
    products:IProduct[];
    preview:string|null;
}

export interface IUser {
	payment: string;
	address: string;
    email: string;
	phone: string;
}

export interface IUserData {
	setUserInfo(userData: IUser): void;
	checkValidation(data: Record<keyof TPaymentDetails&TUserContacts, string>): boolean;
}

export interface IOrder extends IUser {
	items: Pick<IProduct, 'id'>[]; //список id товаров
	total:number; // стоимость заказа
}

export interface OrderResult {
	id: string;
	total:number;
}

export interface IShopAPI {
	getProducts: () => Promise<IProduct[]>;
	createOrder: (order: IOrder) => Promise<OrderResult>;
}

export type TProductInfo = Pick<IProduct, 'description'|'image'|'title'|'category'|'price'>;

// export type TProductShortInfo = Pick<IProduct, 'image'|'title'|'category'|'price'>;

export type TBasketProductInfo = Pick<IProduct, 'title'|'price'>;

export type TPaymentDetails = Pick<IUser, 'payment'|'address'>;

export type TUserContacts = Pick<IUser, 'email'|'phone'>;

export type TOrderCost= Pick<IOrder, 'total'>


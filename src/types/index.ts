export type ApiGetResponse<Type> = {
    total: number; // количество товаров 
	items: Type[]; //список товаров
};

export type ApiOrderResponse<Type> = {
    id: Type;       //id заказа
	total: number; // стоимость заказа
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
    previewId:string|null;
	getProduct(productId: string):IProduct;
}

export interface IOrderForm {
	payment: string;
	address: string;
    email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	items: string[]; //список id товаров
	total:number; // стоимость заказа
}

export interface IOrderData extends IOrderForm{
	order:IOrder;
	getBasketProducts():TBasketProductInfo[];
	deleteBasketProduct(productId: string):void;
	getBasketTotal ():number;
	clearBasket ():void;
	getOrderButtonState (productId: string):boolean;
	setOrderField(field: keyof IOrderForm, value: string, fieldsToValidate?: Array<keyof IOrderForm>):void;
	validateOrder(fieldsToValidate?: Array<keyof IOrderForm>):void;

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

export type TBasketProductInfo = Pick<IProduct, 'id'|'title'|'price'>;

export type TOrderCost= Pick<IOrder, 'total'>


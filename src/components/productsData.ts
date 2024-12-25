import { IEvents } from "./base/events";
import { IProduct, IProductsData } from "../types";
// import { constraintsCard } from "../utils/constants";


export class ProductsData implements IProductsData {
   protected _products: IProduct[];
   protected _preview: string | null;
   protected events: IEvents;
   constructor(events: IEvents) {
    this.events = events;
    }
    set products(products:IProduct[]) {
        this._products = products;
        this.events.emit('products:changed')
    }

    get products () {
        return this._products;
    }

    getProduct(productId: string) {
        return this._products.find((item) => item.id === productId)
    }

    set preview(productId: string | null) {
        if (!productId) {
            this._preview = null;
            return;
        }
        const selectedProduct = this.getProduct(productId);
        if (selectedProduct) {
            this._preview = productId;
            this.events.emit('product:selected')
        }
    }

    get preview() {
        return  this._preview;
    }
}


// export class CardData implements ICardsData {

//     set preview(cardId: string | null) {
//         if (!cardId) {
//             this._preview = null;
//             return;
//         }
//         const selectedCard = this.getCard(cardId);
//         if (selectedCard) {
//             this._preview = cardId;
//             this.events.emit('card:selected')
//         }
//     }
    
//     checkValidation(data: Record<keyof TCardInfo, string>) {
//         const isValid = !Boolean(validate(data, constraintsCard ));
//         return isValid;
//     }

// 	checkField(data: { field: keyof TCardInfo; value: string }) {
// 		switch (data.field) {
// 			case 'name':
// 				return this.checkName(data.value);
// 			case 'link':
// 				return this.checkLink(data.value);
// 		}
// 	}

// 	checkName(value: string) {
//        const result = validate.single(value, constraintsCard.name, );
//        if (result) {
//         return result[0]
//        } else {
//         return '';
//        }
                
// 	}

// 	checkLink(value: string) {
//         const result = validate.single(value, constraintsCard.link, );
//         if (result) {
//          return result[0]
//         } else {
//          return '';
//         }
//      }

//     get preview () {
//         return this._preview;
//     }
// }
import './scss/styles.scss';
import { ShopApi } from './components/shopApi';
import { API_URL } from './utils/constants';
import { CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';


const api = new ShopApi(API_URL);
const gallery = document.querySelector(".gallery") as HTMLElement;
const itemTemplate: HTMLTemplateElement = document.querySelector("#card-catalog");
const card = itemTemplate.content
        .querySelector('.gallery__item')
        .cloneNode(true) as HTMLTemplateElement;

api.getItems().then((items)=> renderCards(items, gallery));

function createCard(cardData: Item) {
    // const {
    //   cardData,
    // } = parametersObj;

    const card = itemTemplate.content
    .querySelector('.gallery__item')
    .cloneNode(true) as HTMLElement;
    const cardCategory = card.querySelector(".card__category");
    const cardTitle = card.querySelector(".card__title");
    const cardImage = card.querySelector(".card__image") as HTMLImageElement;
    const cardPrice = card.querySelector(".card__price");
    cardCategory.textContent = cardData["category"];
    cardTitle.textContent = cardData["title"];
    // cardImage.alt = `${cardData["name"]} фото`;
    cardImage.src = CDN_URL + cardData["image"];
    cardPrice.textContent = String(cardData["price"]) 
  
    return card;
  }

  export interface Item {
	  id:string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number|null
}

// export type ItemList = {
//     items:Item[];
// };

function renderCards(items:Item[], cardsContainer:HTMLElement) {
    // const { items, cardsContainer} =
    //   parametersObj;
  
      items.forEach((itemData) => {
      const card = createCard(
        itemData
      );
      console.log(itemData)
     return cardsContainer.append(card);
    });
  }

  interface IBasketModel {
    items: Map<string, number>;
    add(id:string):void;
    remove(id:string):void;
  }

  interface IEventEmitter {
    emit: (event:string, data:unknown) => void;
  }

  class BasketModel implements IBasketModel {
    items:Map<string, number> = new Map();
    constructor (protected events:IEventEmitter) {}
    add (id:string):void {
      if (!this.items.has(id)) this.items.set(id, 0); // создаем новый
      this.items.set(id, this.items.get(id)! +1); // прибавляем количество
      this._changed();
    }
    remove (id:string):void {
      if (!this.items.has(id)) return; // если нет, то ничего не делаем
      if (this.items.get(id)!>0) { // если есть и больше ноля, то 
        this.items.set(id, this.items.get(id)!-1) // уменьшаем
        if (this.items.get(id)===0) this.items.delete(id); // если уменьшили до нуля, то удаляем
        this._changed();
      }
    }

    protected _changed() { // метод, генерирующий уведомление об изменении
      this.events.emit('basket:change', {items: Array.from(this.items.keys())})
    }
  }

  const events = new EventEmitter();
  const basket = new BasketModel(events);
  events.on ('basket:change', (data:{items:string[]})=> {

  });

  interface IProduct {
    id:string;
    title:string;
  }

  interface CatalogModel {
    items: IProduct[];
    setItems(items:IProduct[]):void; //чтобы установить после загрузки из апи
    getProduct(id:string):IProduct; // чтобы получить при рендере списков
  }
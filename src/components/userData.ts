import { IUser } from "../types";
import { IUserData } from "../types";
import { IEvents } from "./base/events";

export class UserData implements IUserData {
    protected _payment: string;
    protected _address: string;
    protected _email: string;
    protected _phone: string ;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        }

    set payment (payment: string) {
        this._payment = payment;
    }

    set address (address: string) {
        this._address = address;
    }

    set email (email: string) {
        this._email = email;
    }

    set phone (phone: string) {
        this._phone = phone;
    }

    checkValidation(data: Record<keyof IUser, string>): boolean {
        return true
    }
}
import { LocalDateTime } from 'js-joda';
import { OrderStatus } from './OrderStatus';
import { Pay } from './Pay';

export class Order {

    private _id: number;
    private _amount: number;
    private _status: OrderStatus;
    private _orderDateTime: LocalDateTime;
    private _acceptDateTime: LocalDateTime;
    private _description: string;
    private _parentId: number;
    private _pays: Pay[];

    constructor() {
        this._id = Order.generateId();
        this._parentId = this._id;
    }

    private static generateId(): number {
        return Math.random() * (99999 - 1) + 1;
    }

    static create (amount: number, orderTime: LocalDateTime, description: string): Order {
        const newOrder = new Order();
        newOrder._amount = amount;
        newOrder._status = OrderStatus.REQUEST;
        newOrder._orderDateTime = orderTime;
        newOrder._description = description;
        return newOrder;
    }

    static createWithPays (pays: Pay[], orderTime: LocalDateTime, description: string): Order {
        const newOrder = new Order();
        newOrder._amount = pays?.reduce((sum, pay) => sum + pay.amount, 0);
        newOrder._status = OrderStatus.REQUEST;
        newOrder._orderDateTime = orderTime;
        newOrder._description = description;
        return newOrder;
    }

    cancel(cancelTime:LocalDateTime): Order {
        const cancelOrder = new Order();
        cancelOrder._amount = this._amount * -1;
        cancelOrder._status = OrderStatus.CANCEL;
        cancelOrder._orderDateTime = cancelTime;
        cancelOrder._description = this._description;
        cancelOrder._parentId = this._id;
        return cancelOrder;
    }

    update(other: Order): void {
        this._orderDateTime = other._orderDateTime;
        this._description = other._description;
        this._amount = other._amount;
    }

    updateAmount(amount: number): void {
        this._amount = amount;
    }

    copy(): Order {
        const order = new Order();
        order._id = this._id;
        order._orderDateTime = this._orderDateTime;
        order._amount= this._amount;
        order._status= this._status;
        order._description= this._description;
        order._parentId= this._parentId;
        order._pays= this._pays;

        return order;
    }

    accept(now: LocalDateTime): void {
        this._status = OrderStatus.APPROVAL;
        this._acceptDateTime = now;
    }

    complete(now: LocalDateTime): void {
        this._status = OrderStatus.COMPLETED;
        this._acceptDateTime = now;
    }

    get id(): number {
        return this._id;
    }

    get amount(): number {
        return this._amount;
    }

    get status(): OrderStatus {
        return this._status;
    }

    get orderDateTime(): LocalDateTime {
        return this._orderDateTime;
    }

    get description(): string {
        return this._description;
    }

    get parentId(): number {
        return this._parentId;
    }

    get pays(): Pay[] {
        return this._pays;
    }

    get acceptDateTime(): LocalDateTime {
        return this._acceptDateTime;
    }

    isNotCompleted() {
        return this._status != OrderStatus.COMPLETED;
    }
}

import { DayOfWeek, LocalDateTime } from 'js-joda';
import { OrderStatus } from './OrderStatus';
import { Pay } from './Pay';
import { getConnection } from 'typeorm';

export default class Order {

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

    static of (amount: number, orderStatus: OrderStatus): Order {
        const newOrder = new Order();
        newOrder._amount = amount;
        newOrder._status = orderStatus;
        return newOrder;
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

    validateAccept(): void {
        if(this.amount < 0) {
            throw new Error(`주문시 -금액은 될 수 없습니다. amount=${this.amount}`);
        }

        if(!this.description) {
            throw new Error(`주문명은 필수입니다.`);
        }
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

    createCancel(): Order {
        const cancelTime = LocalDateTime.now();
        if(this._orderDateTime >= cancelTime) {
            throw new Error('주문 시간이 주문 취소 시간보다 늦을 수 없습니다.');
        }

        const cancelOrder = new Order();
        cancelOrder._amount = this._amount * -1;
        cancelOrder._status = OrderStatus.CANCEL;
        cancelOrder._orderDateTime = cancelTime;
        cancelOrder._description = this._description;
        cancelOrder._parentId = this._id;
        return cancelOrder;
    }

    async cancelOrder() {
        const cancelTime = LocalDateTime.now();
        if(this._orderDateTime >= cancelTime) {
            throw new Error('주문 시간이 주문 취소 시간보다 늦을 수 없습니다.');
        }

        const cancelOrder = new Order();
        cancelOrder._amount = this._amount * -1;
        cancelOrder._status = OrderStatus.CANCEL;
        cancelOrder._orderDateTime = cancelTime;
        cancelOrder._description = this._description;
        cancelOrder._parentId = this._id;

        await getConnection()
          .getRepository(Order)
          .save(cancelOrder);
    }

    discount() {
        const now = LocalDateTime.now()
        if (now.dayOfWeek() == DayOfWeek.SUNDAY) {
            this._amount = this._amount * 0.9
        }
    }

    discountWith(now: LocalDateTime) {
        if (now.dayOfWeek() == DayOfWeek.SUNDAY) {
            this._amount = this._amount * 0.9
        }
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

    equalsBilling (billingStatus: string): boolean {
        return this._status === billingStatus;
    }

    get id(): number {
        return this._id;
    }

    get amount(): number {
        return this._amount;
    }

    set status(value: OrderStatus) {
        this._status = value;
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
        return !this.isCompleted();
    }

    isCompleted() {
        return this._status === OrderStatus.COMPLETED;
    }

    isCanceled() {
        return this._status === OrderStatus.CANCEL;
    }
}

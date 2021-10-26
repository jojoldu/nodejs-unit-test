import { LocalDateTime } from 'js-joda';
import { OrderStatus } from './OrderStatus';

export class Order {

    private id: number;
    private amount: number;
    private status: OrderStatus;
    private orderDateTime: LocalDateTime;
    private description: string;
    private parentId: number;

    constructor() {
        this.id = Order.generateId();
        this.parentId = this.id;
    }

    private static generateId(): number {
        return Math.random() * (99999 - 1) + 1;
    }

    static create (amount: number, orderTime: LocalDateTime, description: string): Order {
        const newOrder = new Order();
        newOrder.amount = amount;
        newOrder.status = OrderStatus.APPROVAL;
        newOrder.orderDateTime = orderTime;
        newOrder.description = description;
        return newOrder;
    }

    cancel(cancelTime:LocalDateTime): Order {
        const cancelOrder = new Order();
        cancelOrder.amount = this.amount * -1;
        cancelOrder.status = OrderStatus.CANCEL;
        cancelOrder.orderDateTime = cancelTime;
        cancelOrder.description = this.description;
        cancelOrder.parentId = this.id;
        return cancelOrder;
    }
}

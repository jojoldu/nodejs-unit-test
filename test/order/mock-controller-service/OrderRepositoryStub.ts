import { OrderRepository } from '../../../src/order/OrderRepository';
import { Order } from '../../../src/order/Order';

export class OrderRepositoryStub extends OrderRepository {
    private _savedOrder: Order;

    constructor() {
        super();
    }

    override async update(order: Order) {
        this._savedOrder = order;
        return this._savedOrder;
    }

    get savedOrder(): Order {
        return this._savedOrder;
    }
}

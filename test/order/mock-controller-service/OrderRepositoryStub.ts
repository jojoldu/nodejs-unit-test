import { OrderRepository } from '../../../src/order/OrderRepository';
import { Order } from '../../../src/order/Order';

class OrderRepositoryStub extends OrderRepository {
    private _savedOrder: Order;

    constructor() {
        super();
    }

    override update(order: Order): Order {
        this._savedOrder = order;
        return this._savedOrder;
    }

    override


    get savedOrder(): Order {
        return this._savedOrder;
    }
}

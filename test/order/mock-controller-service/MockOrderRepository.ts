import { OrderRepository } from '../../../src/order/OrderRepository';
import { Order } from '../../../src/order/Order';

class MockOrderRepository extends OrderRepository {
    private _savedOrder: Order;

    get savedOrder(): Order {
        return this._savedOrder;
    }

    override insert(order: Order): void {
        this._savedOrder = order;
    }
}

import { Order } from './Order';

export class OrderRepository {
    private static database = new Map<number, Order>();

    constructor() {
        OrderRepository.database.set(1, new Order());
    }

    save (order: Order): Order {
        OrderRepository.database.set(order.id, order);
        return order;
    }

    findById(id: number): Order | undefined {
        return OrderRepository.database.get(id);
    }

}

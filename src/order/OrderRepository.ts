import { Order } from './Order';

export class OrderRepository {
    private static database = new Map<number, Order>();

    constructor() {
        OrderRepository.database.set(1, new Order());
    }

    insert (order: Order): void {
        OrderRepository.database.set(order.id, order);
    }

    save (order: Order): Order {
        OrderRepository.database.set(order.id, order);
        return order;
    }

    update (order: Order): Order {
        const savedOrder = this.findById(order.id);
        savedOrder.update(order);
        OrderRepository.database.set(order.id, savedOrder);
        return savedOrder;
    }

    saveOrUpdate(order: Order) {
        if(order.id) {
            this.update(order);
        } else {
            this.save(order);
        }
    }

    findById(id: number): Order | undefined {
        return OrderRepository.database.get(id);
    }
}

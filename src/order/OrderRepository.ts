import { Order } from './Order';

export class OrderRepository {
    private static database = new Map<number, Order>();

    constructor() {
        OrderRepository.database.set(1, new Order());
    }

    async save (order: Order): Promise<Order> {
        OrderRepository.database.set(order.id, order);
        return order;
    }

    async update (order: Order): Promise<Order> {
        const savedOrder = await this.findById(order.id);
        savedOrder.update(order);
        OrderRepository.database.set(order.id, savedOrder);
        return savedOrder;
    }

    async saveOrUpdate(order: Order) {
        if(order.id) {
            await this.update(order);
        } else {
            await this.save(order);
        }
    }

    async findById(id: number): Promise<Order> {
        return OrderRepository.database.get(id);
    }
}

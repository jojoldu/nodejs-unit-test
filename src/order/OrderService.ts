import { Order } from './Order';
import { OrderRepository } from './OrderRepository';

export class OrderService {
    constructor(private readonly orderRepository: OrderRepository) {}

    async saveOrUpdate(order: Order) {
        const savedOrder = await this.orderRepository.findById(order.id);

    }
}

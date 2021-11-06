import { Order } from './Order';
import { OrderRepository } from './OrderRepository';

export class OrderService {
    constructor(private readonly orderRepository: OrderRepository) {}

    saveOrUpdate(order: Order): void {
        const savedOrder = this.orderRepository.findById(order.id);
        if(savedOrder) {
            savedOrder.update(order);
        } else {
            this.orderRepository.save(order);
        }
    }

}

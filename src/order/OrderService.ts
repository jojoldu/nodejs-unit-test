import { Order } from './Order';
import { OrderRepository } from './OrderRepository';
import { NotFoundException } from '@nestjs/common';
import { LocalDateTime } from 'js-joda';

export class OrderService {
    constructor(private readonly orderRepository: OrderRepository) {
    }

    saveOrUpdate(order: Order): void {
        const savedOrder = this.orderRepository.findById(order.id);
        if (savedOrder) {
            savedOrder.update(order);
        } else {
            this.orderRepository.save(order);
        }
    }

    cancelOrder(orderId: number, cancelTime: LocalDateTime): Order {
        const order: Order | undefined = this.orderRepository.findById(orderId);
        this.validateOrder(order, orderId);

        const cancelOrder = order.cancel(cancelTime);

        return this.orderRepository.save(cancelOrder);
    }

    private validateOrder(order: Order, orderId: number) {
        if (!order) {
            const errorMessage = `orderId=${orderId}에 해당하는 주문이 존재하지 않습니다.`;
            throw new NotFoundException(errorMessage);
        }
    }
}

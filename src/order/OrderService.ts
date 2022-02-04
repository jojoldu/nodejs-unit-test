import { Order } from './Order';
import { OrderRepository } from './OrderRepository';
import { NotFoundException } from '@nestjs/common';
import { LocalDateTime } from 'js-joda';

export class OrderService {
    constructor(private readonly orderRepository: OrderRepository) {
    }

    accept(orderId: number, now = LocalDateTime.now()): void {
        const order = this.orderRepository.findById(orderId);
        order.accept(now);
        this.orderRepository.update(order);
    }

    saveOrUpdate(order: Order): void {
        const savedOrder = this.orderRepository.findById(order.id);
        if (savedOrder) {
            this.orderRepository.update(order);
        } else {
            this.orderRepository.save(order);
        }
    }

    saveOrUpdate2(order: Order): void {
        this.orderRepository.saveOrUpdate(order);
    }

    cancelOrder1(orderId: number, cancelTime: LocalDateTime): Order {
        const order: Order | undefined = this.orderRepository.findById(orderId);
        if (!order) {
            this.logAndThrow(orderId);
        }
        const cancelOrder = order.cancel(cancelTime);

        return this.orderRepository.save(cancelOrder);
    }

    logAndThrow(orderId: number) {
        const errorMessage = `orderId=${orderId}에 해당하는 주문이 존재하지 않습니다.`;
        console.log(errorMessage);
        throw new NotFoundException(errorMessage);
    }

    cancelOrder2(orderId: number, cancelTime: LocalDateTime): Order {
        const order: Order | undefined = this.orderRepository.findById(orderId);
        this.validateOrder(order, orderId);

        const cancelOrder = order.cancel(cancelTime);

        return this.orderRepository.save(cancelOrder);
    }

    validateOrder(order: Order, orderId: number) {
        if (!order) {
            const errorMessage = `orderId=${orderId}에 해당하는 주문이 존재하지 않습니다.`;
            throw new NotFoundException(errorMessage);
        }
    }

}

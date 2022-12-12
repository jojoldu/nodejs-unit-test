import { Order } from './Order';
import { OrderRepository } from './OrderRepository';
import { NotFoundException } from '@nestjs/common';
import { BillingApi } from './BillingApi';
import { Time } from "../nowtime/Time";
import { LocalDateTime } from '@js-joda/core';

export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly billingApi?: BillingApi,
        private readonly time?: Time,
        ) {
    }

    async receipt(amount: number, description: string) {
        if(amount < 0) {
            throw new Error(`금액은 -가 될 수 없습니다. amount=${amount}`);
        }

        if(!Number.isInteger(amount)) {
            throw new Error(`금액은 정수만 가능합니다. amount=${amount}`);
        }

        const order = Order.create(amount, description);

        await this.orderRepository.save(order);
    }

    async discount(orderId: number) {
        const order: Order = await this.orderRepository.findById(orderId);
        order.discount();
        await this.orderRepository.save(order);
    }

    async discountWith(orderId: number, now = LocalDateTime.now()) {
        const order: Order = await this.orderRepository.findById(orderId);
        order.discountWith(now);
        await this.orderRepository.save(order);
    }

    async discountWith2(orderId: number) {
        const order: Order = await this.orderRepository.findById(orderId);
        order.discountWith(this.time.now());
        await this.orderRepository.save(order);
    }

    async validateCompletedOrder(orderId: number): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (order.isNotCompleted()) {
            throw new Error('아직 완료처리되지 못했습니다.');
        }
    }

    async compareBilling(orderId: number) {
        const order = await this.orderRepository.findById(orderId);
        const billingStatus = this.billingApi.getBillingStatus(orderId);

        if(order.equalsBilling(billingStatus)) {
            return ;
        }

        if(order.isCompleted()) {
            this.billingApi.complete(order);
        }

        if(order.isCanceled()) {
            this.billingApi.cancel(order);
        }
    }

    async accept(orderId: number, now = LocalDateTime.now()) {
        const order = await this.orderRepository.findById(orderId);
        order.accept(now);
        await this.orderRepository.update(order);
    }

    /**
     * 케이스1) 외부 API 호출과 이를 저장하는 형태
     * 케이스2) 분기에 따른 서로 다른 API 호출
     */

    async saveOrUpdate(order: Order) {
        const savedOrder = await this.orderRepository.findById(order.id);
        if (savedOrder) {
            await this.orderRepository.update(order);
        } else {
            await this.orderRepository.save(order);
        }
    }

    async saveOrUpdate2(order: Order) {
        await this.orderRepository.saveOrUpdate(order);
    }

    async cancelOrder1(orderId: number, cancelTime: LocalDateTime) {
        const order = await this.orderRepository.findById(orderId);
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

    async cancelOrder2(orderId: number, cancelTime: LocalDateTime) {
        const order = await this.orderRepository.findById(orderId);
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

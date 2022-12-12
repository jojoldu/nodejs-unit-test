import { Order } from '../../src/order/Order';
import { OrderStatus } from '../../src/order/OrderStatus';
import { LocalDateTime } from '@js-joda/core';
import { OrderService } from '../../src/order/OrderService';
import { OrderRepository } from '../../src/order/OrderRepository';
import { BillingApi } from '../../src/order/BillingApi';
import { StubTime } from '../nowtime/StubTime';

describe('Testable Code', () => {
  describe('discount', () => {
    it('일요일에는 주문 금액이 10% 할인된다', () => {
      const sut = Order.of(10_000, OrderStatus.APPROVAL);

      sut.discount();

      expect(sut.amount).toBe(9_000);
    });
  });

  describe('discountWith', () => {
    it('일요일에는 주문 금액이 10% 할인된다', () => {
      const sut = Order.of(10_000, OrderStatus.APPROVAL);
      const now = LocalDateTime.of(2022,8,14,10,15,0); // 2022-08-13 10:15:00 시로 고정
      sut.discountWith(now);

      expect(sut.amount).toBe(9_000);
    });

    it('일요일 외에는 주문 금액이 할인되지 않는다', () => {
      const sut = Order.of(10_000, OrderStatus.APPROVAL);
      const now = LocalDateTime.of(2022,8,15,10,15,0); // 2022-08-13 10:15:00 시로 고정
      sut.discountWith(now);

      expect(sut.amount).toBe(10_000);
    });
  });

  describe('OrderService', () => {
    const repository = new OrderRepository();
    const billingApi = new BillingApi();

    it('일요일에는 주문 금액이 10% 할인된다', async () => {
      const savedOrder = await repository.save(Order.of(10_000, OrderStatus.APPROVAL));
      const sunday = LocalDateTime.of(2022, 8, 14, 10, 15, 0);
      const sut = new OrderService(repository, billingApi, new StubTime(sunday));

      await sut.discountWith2(savedOrder.id);

      const result = await repository.findById(savedOrder.id);

      expect(result.amount).toBe(9_000);
    });
  });
});

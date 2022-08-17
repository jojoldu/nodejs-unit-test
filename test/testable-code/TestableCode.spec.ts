import { Order } from '../../src/order/Order';
import { OrderStatus } from '../../src/order/OrderStatus';
import { LocalDateTime } from 'js-joda';

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
  });
});


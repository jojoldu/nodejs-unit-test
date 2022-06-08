import Order from '../../src/order/Order';
import { OrderStatus } from '../../src/order/OrderStatus';

describe('Testable Code', () => {
  describe('discount', () => {
    it('일요일에는 주문 금액이 10% 할인된다', () => {
      const sut = Order.of(10_000, OrderStatus.APPROVAL);

      sut.discount();

      expect(sut.amount).toBe(9_000);
    });
  });
});


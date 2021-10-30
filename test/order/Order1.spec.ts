import { Order } from '../../src/order/Order';
import { LocalDateTime } from 'js-joda';
import { OrderStatus } from '../../src/order/OrderStatus';

describe('Order1', () => {
    let sut: Order;

    beforeEach(() => {
        sut = Order.create(1000, LocalDateTime.of(2021,10,30, 10,0,0), "배민주문");
    });

    it('주문취소1', () => {
        const cancelOrder: Order = sut.cancel(LocalDateTime.of(2021,10,31,0,0,0));

        expect(cancelOrder.status).toBe(OrderStatus.CANCEL);
        expect(cancelOrder.amount).toBe(-1000);
        expect(cancelOrder.description).toBe('배민주문');
    });

    it('주문취소2', () => {
        expect(sut.cancel(LocalDateTime.of(2021,10,31,0,0,0)).amount).toBe(-1000);
    });
});

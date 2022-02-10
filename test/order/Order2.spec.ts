import { Order } from '../../src/order/Order';
import { LocalDateTime } from 'js-joda';
import { OrderStatus } from '../../src/order/OrderStatus';

describe('Order2', () => {

    it('주문취소1', () => {
        const amount = 1000;
        const description = "배민주문";
        const sut = createOrder(amount,  description);

        const cancelOrder: Order = sut.cancel(LocalDateTime.of(2021,10,31,0,0,0));

        expect(cancelOrder.status).toBe(OrderStatus.CANCEL);
        expect(cancelOrder.amount).toBe(-amount);
        expect(cancelOrder.description).toBe(description);
    });

    it('주문취소2', () => {
        const amount = 1000;
        const sut = createOrder(amount);
        expect(sut.cancel(LocalDateTime.of(2021,10,31,0,0,0)).amount).toBe(-amount);
    });

    it('Enum vs String 비교', () => {
        expect(OrderStatus.COMPLETED === 'COMPLETED').toBeTruthy();
        expect(OrderStatus.COMPLETED !== 'COMPLETED').toBeFalsy();
    });
});

function createOrder(amount: number = 1000, description: string = "배민주문") {
    return Order.create(amount, LocalDateTime.of(2021, 10, 30, 10, 0, 0), description);
}

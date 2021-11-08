import { OrderService } from '../../src/order/OrderService';
import { OrderRepository } from '../../src/order/OrderRepository';

describe('OrderService', () => {
    let orderService: OrderService;

    beforeEach(() => {
        orderService = new OrderService(new OrderRepository());
    });

    it('주문취소', () => {

    });

    it('해당하는 주문이 없으면 에러가 발생한다', () => {

    });
});

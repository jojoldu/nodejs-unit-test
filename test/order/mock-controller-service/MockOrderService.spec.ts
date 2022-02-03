import { mock } from 'ts-mockito';
import { OrderRepository } from '../../../src/order/OrderRepository';

describe('OrderService', () => {
    let mockedRepository: OrderRepository;
    const realRepository: OrderRepository = new OrderRepository();

    beforeEach(() => {
        mockedRepository = mock(OrderRepository);
    });

    it('기존 주문이 있으면 새 정보로 갱신된다', () => {
    });



});

import { mock } from 'ts-mockito';
import { OrderRepository } from '../../../src/order/OrderRepository';
import { Order } from '../../../src/order/Order';
import { LocalDateTime } from 'js-joda';

describe('OrderService', () => {
    let mockedRepository: OrderRepository;

    beforeEach(() => {
        mockedRepository = mock(OrderRepository);
    });

    it('[Stub Class] 해당 주문을 승인처리한다', () => {
        const order = Order.create(1000, LocalDateTime.now(), '');
        const stubRepository: OrderRepository = new class extends OrderRepository {
            override findById(id: number): Order | undefined {
                return order;
            }
        }
    });



});

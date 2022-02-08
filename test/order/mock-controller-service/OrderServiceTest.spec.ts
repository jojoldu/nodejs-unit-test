import { mock } from 'ts-mockito';
import { OrderRepository } from '../../../src/order/OrderRepository';
import { Order } from '../../../src/order/Order';
import { LocalDateTime } from 'js-joda';
import { OrderService } from '../../../src/order/OrderService';
import { OrderStatus } from '../../../src/order/OrderStatus';

describe('OrderService', () => {
    let mockedRepository: OrderRepository;

    beforeEach(() => {
        mockedRepository = mock(OrderRepository);
    });

    it('[Stub Class] 해당 주문을 승인처리한다', () => {
        // given
        const order = Order.create(1000, LocalDateTime.now(), '');
        const stubRepository = new class extends OrderRepository {
            _savedOrder: Order;

            override findById(id: number): Order | undefined {
                return order;
            }

            override update(order: Order): Order {
                return this._savedOrder = order;
            }
        }
        const sut = new OrderService(stubRepository);
        const now = LocalDateTime.of(2022,2,8,0,0,0);

        // when
        sut.accept(order.id, now);

        // then
        expect(stubRepository._savedOrder.status).toBe(OrderStatus.APPROVAL);
        expect(stubRepository._savedOrder.acceptDateTime).toBe(now);
    });



});

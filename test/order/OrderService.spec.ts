import { OrderService } from '../../src/order/OrderService';
import { OrderRepository } from '../../src/order/OrderRepository';
import { anyNumber, anything, instance, mock, verify, when } from 'ts-mockito';
import { Order } from '../../src/order/Order';
import { LocalDateTime } from 'js-joda';

describe('OrderService', () => {
    let mockedRepository: OrderRepository;
    const realRepository: OrderRepository = new OrderRepository();

    beforeEach(() => {
        mockedRepository = mock(OrderRepository);
    });

    it('기존 주문이 있으면 새 정보로 갱신된다', () => {
        const savedOrder = Order.create(1000, LocalDateTime.now(), '');
        when(mockedRepository.findById(anyNumber())).thenReturn(savedOrder);
        const sut = new OrderService(instance(mockedRepository));

        sut.saveOrUpdate(createOrder(savedOrder, 200));

        verify(mockedRepository.update(anything())).called();
    });

    it('[After] 기존 주문이 있으면 새 정보로 갱신된다', () => {
        const savedOrder = realRepository.save(Order.create(1000, LocalDateTime.now(), ''));
        const expectAmount = 200;

        const sut = new OrderService(realRepository);
        sut.saveOrUpdate2(createOrder(savedOrder, expectAmount));

        const result = realRepository.findById(savedOrder.id);

        expect(result.amount).toBe(expectAmount);
    });

    function createOrder(origin: Order, amount: number): Order {
        const order = origin.copy();
        order.updateAmount(amount);
        return order;
    }


});

import { OrderService } from '../../src/order/OrderService';
import { OrderRepository } from '../../src/order/OrderRepository';
import { anyNumber, anything, instance, mock, verify, when } from 'ts-mockito';
import { Order } from '../../src/order/Order';
import { LocalDateTime } from '@js-joda/core';
import { BillingApi } from '../../src/order/BillingApi';
import { JodaTime } from '../../src/nowtime/JodaTime';

describe('OrderService', () => {
    let mockedRepository: OrderRepository;
    const realRepository: OrderRepository = new OrderRepository();
    const billingApi = new BillingApi();

    beforeEach(() => {
        mockedRepository = mock(OrderRepository);
    });

    it('기존 주문이 있으면 새 정보로 갱신된다', () => {
        const savedOrder = Order.create(1000, '', LocalDateTime.now());
        when(mockedRepository.findById(anyNumber())).thenReturn(new Promise(() => savedOrder));
        const sut = new OrderService(instance(mockedRepository), billingApi, new JodaTime());

        sut.saveOrUpdate(createOrder(savedOrder, 200));

        verify(mockedRepository.update(anything())).called();
    });

    it('[After] 기존 주문이 있으면 새 정보로 갱신된다', async () => {
        const savedOrder = await realRepository.save(Order.create(1000, '', LocalDateTime.now()));
        const expectAmount = 200;

        const sut = new OrderService(realRepository, billingApi, new JodaTime());
        await sut.saveOrUpdate2(createOrder(savedOrder, expectAmount));

        const result = await realRepository.findById(savedOrder.id);

        expect(result.amount).toBe(expectAmount);
    });

    function createOrder(origin: Order, amount: number): Order {
        const order = origin.copy();
        order.updateAmount(amount);
        return order;
    }


});

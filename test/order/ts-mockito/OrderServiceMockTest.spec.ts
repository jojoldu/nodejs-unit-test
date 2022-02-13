import { anyNumber, instance, mock, when } from 'ts-mockito';
import { OrderRepository } from '../../../src/order/OrderRepository';
import { Order } from '../../../src/order/Order';
import { LocalDateTime } from 'js-joda';
import { OrderService } from '../../../src/order/OrderService';

describe('OrderService', () => {

    describe('주문 완료 검증', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('[jest.mock] 주문이 완료되지 못했다면 에러가 발생한다', () => {
            // given
            let mockRepository = new OrderRepository();
            jest.spyOn(mockRepository, 'findById')
                .mockImplementation(() => Order.create(1000, LocalDateTime.now(), ''));

            const sut = new OrderService(mockRepository);

            // when
            const actual = () => {
                sut.validateCompletedOrder(1)
            };

            // then
            expect(actual).toThrow('아직 완료처리되지 못했습니다.');
        });

        it('[ts-mockito] 주문이 완료되지 못했다면 에러가 발생한다', () => {
            // given
            const order = Order.create(1000, LocalDateTime.now(), '');

            const stubRepository: OrderRepository = mock(OrderRepository);
            when(stubRepository.findById(anyNumber())).thenReturn(order);

            const sut = new OrderService(instance(stubRepository));

            // when
            const actual = () => {
                sut.validateCompletedOrder(1)
            };

            // then
            expect(actual).toThrow('아직 완료처리되지 못했습니다.');
        });
    });

});



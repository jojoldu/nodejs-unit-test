import { anyNumber, instance, mock, when } from 'ts-mockito';
import { OrderRepository } from '../../../src/order/OrderRepository';
import { Order } from '../../../src/order/Order';
import { LocalDateTime } from 'js-joda';
import { OrderService } from '../../../src/order/OrderService';
import { OrderStatus } from '../../../src/order/OrderStatus';
import { BillingApiStub } from './BillingApiStub';
import { OrderRepositoryStub } from './OrderRepositoryStub';

describe('OrderService', () => {
    let mockedRepository: OrderRepository;

    beforeEach(() => {
        mockedRepository = mock(OrderRepository);
    });

    describe('주문 완료 검증', () => {
        it('[Stub Class] 주문이 완료되었다면 에러가 발생하지 않는다', () => {
            // given
            const now = LocalDateTime.now();
            const stubRepository = new class extends OrderRepository {
                override findById(id: number): Order | undefined {
                    const order = Order.create(1000, now, '');
                    order.complete(now);
                    return order;
                }
            }

            const sut = new OrderService(stubRepository);

            // when
            sut.validateCompletedOrder(1);

        });

        it('[Stub Class2] 주문이 완료되지 못했다면 에러가 발생한다', () => {
            // given
            const sut = new OrderService(new OrderRepositoryStub());

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


    describe('주문-결제 대사', () => {
        it('주문이 완료인데, 결제가 아닐경우 결제 완료 요청을 한다', () => {
            // given
            const orderStatus = OrderStatus.COMPLETED;
            const order = Order.of(1000, orderStatus);

            const billingStatus = "CANCEL";
            const billingApiStub = new BillingApiStub(billingStatus);

            const stubRepository: OrderRepository = mock(OrderRepository);
            when(stubRepository.findById(anyNumber())).thenReturn(order);

            const sut = new OrderService(instance(stubRepository), billingApiStub);

            // when
            sut.compareBilling(order.id);

            // then
            expect(billingApiStub.completedOrder.id).toBe(order.id);
            expect(billingApiStub.completedOrder.status).toBe(orderStatus);
            expect(billingApiStub.canceledOrder).toBeUndefined();
        });

        it('주문이 취소인데, 결제가 아닐경우 결제 취소 요청을 한다', () => {
            // given
            const orderStatus = OrderStatus.CANCEL;
            const order = Order.of(1000, orderStatus);

            const billingStatus = "COMPLETED";
            const billingApiStub = new BillingApiStub(billingStatus);

            const stubRepository: OrderRepository = mock(OrderRepository);
            when(stubRepository.findById(anyNumber())).thenReturn(order);

            const sut = new OrderService(instance(stubRepository), billingApiStub);

            // when
            sut.compareBilling(order.id);

            // then
            expect(billingApiStub.canceledOrder.id).toBe(order.id);
            expect(billingApiStub.canceledOrder.status).toBe(orderStatus);
            expect(billingApiStub.completedOrder).toBeUndefined();
        });

        it('주문과 결제가 동일한 상태일경우 추가결제요청은 하지 않는다', () => {
            // given
            const orderStatus = OrderStatus.COMPLETED;
            const order = Order.of(1000, orderStatus);

            const billingStatus = "COMPLETED";
            const billingApiStub = new BillingApiStub(billingStatus);

            const stubRepository: OrderRepository = mock(OrderRepository);
            when(stubRepository.findById(anyNumber())).thenReturn(order);

            const sut = new OrderService(instance(stubRepository), billingApiStub);

            // when
            sut.compareBilling(order.id);

            // then
            expect(billingApiStub.completedOrder).toBeUndefined();
            expect(billingApiStub.canceledOrder).toBeUndefined();
        });
    });

    describe('주문 승인 처리', () => {
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
            const now = LocalDateTime.of(2022, 2, 8, 0, 0, 0);

            // when
            sut.accept(order.id, now);

            // then
            expect(stubRepository._savedOrder.status).toBe(OrderStatus.APPROVAL);
            expect(stubRepository._savedOrder.acceptDateTime).toBe(now);
        });
    });
});



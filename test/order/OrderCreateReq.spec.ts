import { OrderCreateReq } from '../../src/order/OrderCreateReq';
import { OrderStatus } from '../../src/order/OrderStatus';

describe('OrderCreateReq', () => {

    describe('구현검증', () => {
        it('주문접수시 금액이 음수이면 오류가 발생한다', () => {
            const sut = OrderCreateReq.createWithEmptyDesc(-1000, OrderStatus.APPROVAL);

            expect(() => sut.validateApproval()).toThrow(Error);
            expect(() => sut.validateApproval()).toThrow('주문요청일때는 금액이 0원 미만일 수 없습니다.');
        });

        it('주문접수시 금액이 음수이면 오류가 발생한다', () => {
            const sut = OrderCreateReq.createWithEmptyDesc(1000, OrderStatus.CANCEL);

            expect(() => sut.validateCancel()).toThrow(Error);
            expect(() => sut.validateCancel()).toThrow('주문취소일때는 금액이 0원 이상일 수 없습니다.');
        });
    });

    describe('명세 검증', () => {
        it('주문접수시 금액이 음수이면 오류가 발생한다', () => {
            const sut = OrderCreateReq.createWithEmptyDesc(-1000, OrderStatus.APPROVAL);

            expect(() => sut.validate()).toThrow(Error);
            expect(() => sut.validate()).toThrow('주문요청일때는 금액이 0원 미만일 수 없습니다.');
        });

        it('주문접수시 금액이 음수이면 오류가 발생한다', () => {
            const sut = OrderCreateReq.createWithEmptyDesc(1000, OrderStatus.CANCEL);

            expect(() => sut.validate()).toThrow(Error);
            expect(() => sut.validate()).toThrow('주문취소일때는 금액이 0원 이상일 수 없습니다.');
        });
    });

});

import { OrderAmountSum } from '../../src/order/OrderAmountSum';

describe('OrderAmountSum', () => {
    it('plusSum에는 양수들의 총합이 등록된다', () => {
        const sut = new OrderAmountSum([
            1000, 300, -100, -500
        ]);

        expect(sut.plusSum).toBe(1300);
    });

    it('minusSum에는 음수들의 총합이 등록된다', () => {
        const sut = new OrderAmountSum([
            1000, 300, -100, -500
        ]);

        expect(sut.minusSum).toBe(-600);
    });

    it('전체 합계 금액을 구한다', () => {
        const sut = new OrderAmountSum([
            1000, 300, -100, -500
        ]);

        expect(sut.sumAmount).toBe(700);
    });

});

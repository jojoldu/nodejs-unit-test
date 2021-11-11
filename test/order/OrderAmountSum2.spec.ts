import { OrderAmountSum2 } from '../../src/order/OrderAmountSum2';

describe('OrderAmountSum2', () => {
    it('전체 합계 금액을 구한다', () => {
        const sut = new OrderAmountSum2([
            1000, 300, -100, -500
        ]);

        expect(sut.sumAmount).toBe(700);
    });

    it('-금액들의 합계 금액을 구한다', () => {
        const sut = new OrderAmountSum2([
            -1000, -300, -100, -500
        ]);

        expect(sut.sumAmount).toBe(-1900);
    });
});

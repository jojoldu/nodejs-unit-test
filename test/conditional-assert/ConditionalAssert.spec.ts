import { Calculator } from '../../src/calculator/Calculator';

describe('조건부 검증 피하기', () => {
    it('프로덕션 로직을 테스트에서 사용하는 경우', () => {
        const sut = new Calculator();
        let result;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const actual = sut.calculate( i, j );

                if (i==3 && j==4)  // 특이케이스
                    result = 8;
                else
                    result = i+j;

                expect(result).toBe(actual);
            }
        }
    });
});

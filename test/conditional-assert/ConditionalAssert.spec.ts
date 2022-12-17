import { Calculator } from '../../src/calculator/Calculator';
import { DateTimeFormatter, LocalDateTime } from '@js-joda/core';
import { TimeDisplay } from '../../src/time-display/TimeDisplay';
import { OrderStatus } from '../../src/order/OrderStatus';
import { Order } from '../../src/order/Order';

describe('조건부 검증 피하기', () => {
    it('[Bad] 가변결과 검증하는 경우', () => {
        const now = LocalDateTime.now();
        const sut = new TimeDisplay();
        const result = sut.display(now);

        let actual;
        if (now.hour() === 0 && now.minute() === 0) {
            actual = 'Midnight';
        } else if (now.hour() === 12 && now.minute() === 0) {
            actual = 'Noon';
        } else {
            actual = now.format(DateTimeFormatter.ofPattern(
                'HH:mm:ss',
            ));
        }

        expect(result).toBe(actual);
    });

    describe('[Good] 가변결과 검증하는 경우', () => {

        it('자정인경우 Midnight가 반환된다', () => {
            const time = LocalDateTime.of(2022, 1, 1)
                .withHour(0)
                .withMinute(0)
                .withSecond(0);
            const sut = new TimeDisplay();

            const result = sut.display(time);

            expect(result).toBe('Midnight');
        });

        it.each([
            [0, 0, 'Midnight'],
            [12, 0, 'Noon'],
            [1, 1, '01:01:00'],
        ])("hour=%s, minute=%s 이면 actual=%s", (hour, minute, actual) => {
            const time = LocalDateTime.of(2022, 1, 1)
                .withHour(hour)
                .withMinute(minute)
                .withSecond(0);
            const sut = new TimeDisplay();

            const result = sut.display(time);

            expect(result).toBe(actual);
        });
    });

    it('[Bad] 테스트에서 프로덕션 로직 사용', () => {
        const sut = new Calculator();
        let result;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const actual = sut.calculate(i, j);

                if (i == 3 && j == 4)  // 특이케이스
                    result = 8;
                else
                    result = i + j;

                expect(result).toBe(actual);
            }
        }
    });

    describe('[Good] 테스트에서 프로덕션 로직 사용', () => {
        it('[Good] Calculator 에 3, 4가 입력되면 8이 반환된다', () => {
            const sut = new Calculator();

            const result = sut.calculate(3, 4);

            expect(result).toBe(8);
        });

        it.each([
            [3, 4, 8],
            [1, 1, 2],
        ])("num1=%s, num2=%s 이면 actual=%s", (num1, num2, actual) => {
            const sut = new Calculator();

            const result = sut.calculate(num1, num2);

            expect(result).toBe(actual);
        });
    });


    describe('중복 코드 추출로 인한 다중 검증', () => {
        it('[Bad] 추출된 중복 테스트 코드#1', () => {
            testOrder(OrderStatus.COMPLETED);
        });

        it('[Bad] 추출된 중복 테스트 코드#2', () => {
            testOrder(OrderStatus.CANCEL);
        });

        function testOrder(status: OrderStatus): void {
            const order = new Order();
            order.status = status;

            if (status === OrderStatus.COMPLETED) {
                expect(order.isCompleted()).toBe(true); // boolean 타입까지 일치하는 것을 확인하기 위해
            } else if (status === OrderStatus.CANCEL) {
                expect(order.isCanceled()).toBe(true);
            }
        }

        it('[Good] 추출된 중복 테스트 코드#1', () => {
            const sut = createOrder(OrderStatus.COMPLETED);

            expect(sut.isCompleted()).toBe(true);
        });

        it('[Good] 추출된 중복 테스트 코드#2', () => {
            const sut = createOrder(OrderStatus.CANCEL);

            expect(sut.isCanceled()).toBe(true);
        });

        function createOrder(status: OrderStatus): Order {
            const order = new Order();
            order.status = status;
            return order;
        }
    });
});




import { Calculator } from '../../src/calculator/Calculator';
import { DateTimeFormatter, LocalDateTime } from 'js-joda';
import { TimeDisplay } from '../../src/time-display/TimeDisplay';
import { OrderStatus } from '../../src/order/OrderStatus';
import { Order } from '../../src/order/Order';

describe('조건부 검증 피하기', () => {
    it('[Bad] 가변결과 검증하는 경우', () => {
        const now = LocalDateTime.now();
        const sut = new TimeDisplay();
        const result = sut.display(now);

        let actual;
        if(now.hour() === 0 && now.minute() === 0) {
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
      it.each([
          [0, 0, 'Midnight'],
          [12, 0, 'Noon'],
          [1, 1, '01:01:00'],
      ])("hour=%s, minute=%s 이면 actual=%s", (hour, minute, actual) => {
          const time = LocalDateTime.now()
              .withHour(hour)
              .withMinute(minute)
              .withSecond(0);
          const sut = new TimeDisplay();

          const result = sut.display(time);

          expect(result).toBe(actual);
      });
    });




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

    describe('주문 상태 검증', () => {
        it('추출된 중복 테스트 코드#1', () => {
            testOrder(OrderStatus.COMPLETED);
        });

        it('추출된 중복 테스트 코드#2', () => {
            testOrder(OrderStatus.CANCEL);
        });

        function testOrder(status: OrderStatus): void {
            const order = new Order();
            order.status = status;

            if(status === OrderStatus.COMPLETED) {
                expect(order.isCompleted()).toBeTruthy();
            } else if (status === OrderStatus.CANCEL) {
                expect(order.isCanceled()).toBeTruthy();
            }
        }
    });

});




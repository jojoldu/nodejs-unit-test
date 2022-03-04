import { LocalDate, LocalDateTime, LocalTime } from 'js-joda';

describe('LocalDate, LocalDateTime', () => {
    describe('LocalDate', () => {
        it('withXX는 값을 강제로 변경한다', () => {
            const sut = LocalDateTime.of(LocalDate.now(), LocalTime.of(1,1,1));

            const changeTime = 2;
            const actual = sut
                .withHour(changeTime)
                .withMinute(changeTime)
                .withSecond(changeTime)

            expect(actual.hour()).toBe(changeTime);
            expect(actual.minute()).toBe(changeTime);
            expect(actual.second()).toBe(changeTime);
        });
    });
});

import { DateTimeFormatter, LocalDateTime } from '@js-joda/core';
import { TimeDisplay } from '../../src/time-display/TimeDisplay';

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

});




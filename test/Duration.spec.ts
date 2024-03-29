import { Duration } from '@js-joda/core';
import { DateTimeUtil } from '../src/util/DateTimeUtil';

describe('Duration', () => {
    it('하루는 24 * 60 * 60 * 1000 ms로 치환된다', () => {
        const expected = 24 * 60 * 60 * 1000;
        expect(Duration.ofDays(1).toMillis()).toBe(expected);
    });

    it.skip('promise test', async () => {
        await DateTimeUtil.testCatch();
    });

    it('async test', async () => {
        await DateTimeUtil.testCatch2();
    });
});

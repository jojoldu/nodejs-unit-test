import { Enum, EnumType } from 'ts-jenum';

enum Time {
    MILLISECONDS,
    SECONDS,
    MINUTES,
    HOURS,
    DAYS,
}

/**


MILLISECONDS {
    toMillis(long t)  { return t; }
    toSeconds(long t) { return t/(MILLIS_TO_SEC / DEFAULT_VALUE); }
    toMinutes(long t) { return t/(SEC_TO_MINUTES / DEFAULT_VALUE); }
    toHours(long t)   { return t/(MINUTES_TO_HOURS / DEFAULT_VALUE); }
    toDays(long t)    { return t/(HOURS_TO_DAYS / DEFAULT_VALUE); }
    convert(long t, TimeUnit u) { return u.toMillis(t); }
},

SECONDS {
    toMillis(long t)  { return calculate(t, MILLIS_TO_SEC / DEFAULT_VALUE, MAX/(MILLIS_TO_SEC / DEFAULT_VALUE)); }
    toSeconds(long t) { return t; }
    toMinutes(long t) { return t/(SEC_TO_MINUTES / MILLIS_TO_SEC); }
    toHours(long t)   { return t/(MINUTES_TO_HOURS / MILLIS_TO_SEC); }
    toDays(long t)    { return t/(HOURS_TO_DAYS / MILLIS_TO_SEC); }
    convert(long t, TimeUnit u) { return u.toSeconds(t); }
},


MINUTES {
    toMillis(long t)  { return calculate(t, SEC_TO_MINUTES / DEFAULT_VALUE, MAX/(SEC_TO_MINUTES / DEFAULT_VALUE)); }
    toSeconds(long t) { return calculate(t, SEC_TO_MINUTES / MILLIS_TO_SEC, MAX/(SEC_TO_MINUTES / MILLIS_TO_SEC)); }
    toMinutes(long t) { return t; }
    toHours(long t)   { return t/(MINUTES_TO_HOURS / SEC_TO_MINUTES); }
    toDays(long t)    { return t/(HOURS_TO_DAYS / SEC_TO_MINUTES); }
    convert(long t, TimeUnit u) { return u.toMinutes(t); }
},


HOURS {
    toMillis(long t)  { return calculate(t, MINUTES_TO_HOURS / DEFAULT_VALUE, MAX/(MINUTES_TO_HOURS / DEFAULT_VALUE)); }
    toSeconds(long t) { return calculate(t, MINUTES_TO_HOURS / MILLIS_TO_SEC, MAX/(MINUTES_TO_HOURS / MILLIS_TO_SEC)); }
    toMinutes(long t) { return calculate(t, MINUTES_TO_HOURS / SEC_TO_MINUTES, MAX/(MINUTES_TO_HOURS / SEC_TO_MINUTES)); }
    toHours(long t)   { return t; }
    toDays(long t)    { return t/(HOURS_TO_DAYS / MINUTES_TO_HOURS); }
    convert(long t, TimeUnit u) { return u.toHours(t); }
},

DAYS {
    toMillis(long t)  { return calculate(t, HOURS_TO_DAYS / DEFAULT_VALUE, MAX/(HOURS_TO_DAYS / DEFAULT_VALUE)); }
    toSeconds(long t) { return calculate(t, HOURS_TO_DAYS / MILLIS_TO_SEC, MAX/(HOURS_TO_DAYS / MILLIS_TO_SEC)); }
    toMinutes(long t) { return calculate(t, HOURS_TO_DAYS / SEC_TO_MINUTES, MAX/(HOURS_TO_DAYS / SEC_TO_MINUTES)); }
    toHours(long t)   { return calculate(t, HOURS_TO_DAYS / MINUTES_TO_HOURS, MAX/(HOURS_TO_DAYS / MINUTES_TO_HOURS)); }
    toDays(long t)    { return t; }
    convert(long t, TimeUnit u) { return u.toDays(t); }
};
 */

@Enum('type')
export class TimeUnit extends EnumType<TimeUnit>() {
    private static MAX = Number.MAX_VALUE;
    private static DEFAULT_VALUE = 1;
    private static MILLIS_TO_SEC = TimeUnit.DEFAULT_VALUE * 1000;
    private static SEC_TO_MINUTES = TimeUnit.MILLIS_TO_SEC * 60;
    private static MINUTES_TO_HOURS = TimeUnit.SEC_TO_MINUTES * 60;
    private static HOURS_TO_DAYS = TimeUnit.MINUTES_TO_HOURS * 24;

    static readonly MILLISECONDS = new TimeUnit(
        Time.MILLISECONDS, t => t, t => t / ());

    constructor(readonly type: Time, millis: Function, seconds: Function, minutes: Function, hours: Function, days: Function, convert: Function) {
        super();
    }

    calculate(target:number, per: number, over: number) {
        if(target > over) {
            throw new Error(`최대 숫자보다 높은 수를 치환할 순 없습니다. target=${target}`);
        }

        if(target < -over) {
            throw new Error(`최저 숫자보다 낮은 수를 치환할 순 없습니다. target=${target}`);
        }

        return target * per;
    }
}

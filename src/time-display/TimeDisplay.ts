import { DateTimeFormatter, LocalDateTime } from '@js-joda/core';

export class TimeDisplay {
    display (time: LocalDateTime): string {
        if(time.hour() === 0 && time.minute() === 0) {
            return 'Midnight'
        }

        if (time.hour() === 12 && time.minute() === 0) {
            return 'Noon';
        }

        return time.format(DateTimeFormatter.ofPattern(
            'HH:mm:ss',
        ))
    }
}

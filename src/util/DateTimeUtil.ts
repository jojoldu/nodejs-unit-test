import { convert, DateTimeFormatter, LocalDate, LocalDateTime, nativeJs } from '@js-joda/core';

export class DateTimeUtil {
  private static DATE_FORMATTER = DateTimeFormatter.ofPattern('yyyy-MM-dd');
  private static DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(
    'yyyy-MM-dd HH:mm:ss',
  );

  static toString(localDate: LocalDate | LocalDateTime): string {
    if (!localDate) {
      return '';
    }

    if (localDate instanceof LocalDate) {
      return localDate.format(this.DATE_FORMATTER);
    }
    return localDate.format(this.DATE_TIME_FORMATTER);
  }

  static toDate(localDate: LocalDate | LocalDateTime): Date | null {
    if (!localDate) {
      return null;
    }

    return convert(localDate).toDate();
  }

  static toLocalDate(date: Date): LocalDate | null {
    if (!date) {
      return null;
    }
    return LocalDate.from(nativeJs(date));
  }

  static toLocalDateTime(date: Date): LocalDateTime | null {
    if (!date) {
      return null;
    }
    return LocalDateTime.from(nativeJs(date));
  }

  static getLocalDateMin(): LocalDate {
    return LocalDate.of(1970, 1, 1);
  }

  static getLocalDateMax(): LocalDate {
    return LocalDate.of(9999, 12, 31);
  }

  static toLocalDateBy(strDate: string): LocalDate | null {
    if (!strDate) {
      return null;
    }

    return LocalDate.parse(strDate, DateTimeUtil.DATE_FORMATTER);
  }

  static toLocalDateTimeBy(strDate: string): LocalDateTime | null {
    if (!strDate) {
      return null;
    }

    return LocalDateTime.parse(strDate, DateTimeUtil.DATE_TIME_FORMATTER);
  }

  static testCatch() {
    try {
      return DateTimeUtil.testPromise()
          .then(() => console.log('testCatch 성공'));
    } catch (e) {
      console.log('테스트 실패\n', e);
    }
  }

  static async testCatch2() {
    try {
      await DateTimeUtil.testPromise()
      console.log('testCatch 성공');
    } catch (e) {
      console.log('테스트 실패\n', e);
    }
  }

  static testPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('testPromise 에러납니다'));
      }, 100);
    })
  }
}

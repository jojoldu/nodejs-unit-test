import { DateTimeFormatter, LocalDate, LocalDateTime } from '@js-joda/core';

export class DateTime {
  private static DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(
    'yyyy-MM-dd HH:mm:ss',
  );

  static toString(dateTime: LocalDateTime | null): string {
    if (!dateTime) {
      return '';
    }

    return dateTime.format(this.DATE_TIME_FORMATTER);
  }

  static to(dateTime: LocalDateTime): string {
    return dateTime.format(this.DATE_TIME_FORMATTER);
  }
}


function main() {
  const orderedAt = getOrderedAt();
  const dateStr = DateTime.toString(orderedAt);
  subFunction(dateStr);
}

function main2() {
  const orderedAt = getOrderedAt();
  const dateStr = orderedAt ? DateTime.to(orderedAt) : '';
  subFunction(dateStr);
}

function getOrderedAt() : LocalDateTime | null {
  return LocalDateTime.now();
}

function subFunction(dateString: string) {

}
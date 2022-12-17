import { LocalDateTime } from '@js-joda/core';

export interface Time {
  now(): LocalDateTime;
}

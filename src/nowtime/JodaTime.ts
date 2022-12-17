import { Time } from "./Time";
import { LocalDateTime } from '@js-joda/core';

export class JodaTime implements Time {
  now(): LocalDateTime {
    return LocalDateTime.now();
  }
}

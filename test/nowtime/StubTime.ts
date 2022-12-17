import { LocalDateTime } from '@js-joda/core';
import { Time } from "../../src/nowtime/Time";

export class StubTime implements Time{
  private readonly currentTime: LocalDateTime;

  constructor(currentTime: LocalDateTime) {
    this.currentTime = currentTime;
  }

  static of (year:number, month:number, day:number, hour:number, minute:number, second:number) {
    return LocalDateTime.of(year, month, day, hour, minute, second);
  }

  now(): LocalDateTime {
    return this.currentTime;
  }

}

import { LocalDateTime } from "js-joda";
import { Time } from "../../src/nowtime/Time";

export class StubTime implements Time{
  private readonly currentTime: LocalDateTime;

  constructor(currentTime: LocalDateTime) {
    this.currentTime = currentTime;
  }

  now(): LocalDateTime {
    return this.currentTime;
  }

}

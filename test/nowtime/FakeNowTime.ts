import { LocalDateTime } from "js-joda";
import { NowTime } from "../../src/nowtime/NowTime";

export class FakeNowTime implements NowTime{
  private readonly currentTime: LocalDateTime;

  constructor(currentTime: LocalDateTime) {
    this.currentTime = currentTime;
  }

  now(): LocalDateTime {
    return this.currentTime;
  }

}
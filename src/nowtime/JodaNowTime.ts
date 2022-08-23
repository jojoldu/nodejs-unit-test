import { NowTime } from "./NowTime";
import { LocalDateTime } from "js-joda";

export class JodaNowTime implements NowTime {
  now(): LocalDateTime {
    return LocalDateTime.now();
  }
}
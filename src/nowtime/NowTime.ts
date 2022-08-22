import { LocalDateTime } from "js-joda";

export interface NowTime {
  now(): LocalDateTime;
}
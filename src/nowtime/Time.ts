import { LocalDateTime } from "js-joda";

export interface Time {
  now(): LocalDateTime;
}

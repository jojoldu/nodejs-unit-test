import { Time } from "./Time";
import { LocalDateTime } from "js-joda";

export class JodaTime implements Time {
  now(): LocalDateTime {
    return LocalDateTime.now();
  }
}

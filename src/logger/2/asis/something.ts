import { log } from '../../log';

export function something(data) {
  try {
    return someService.doSomething(data);
  } catch (e) {
    log.error(``, e);
    throw new Error("Some error occurred");
  }
}
import { sleep } from './sleep';

async function throwAsync(msg) {
  await sleep(10);
  throw Error(msg);
}

export async function returnWithoutAwait() {
  return throwAsync('without await');
}

import { sleep } from '../sleep';

export async function promiseAllWithoutAwait() {
  const times = [10, 20, 30];

  return Promise.all(times.map(time => sleep(time)));
}

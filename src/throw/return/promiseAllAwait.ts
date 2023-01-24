import { getTime } from './getTime';

const times = [1_000, 2_000, 5_000];
export async function promiseAllAwait() {
  console.log('Without Await');

  return Promise.all(times.map(time =>
    getTime(time, 'Without')
  ));
}

export async function promiseAllWithAwait() {
  console.log('With Await');

  return Promise.all(times.map(async time =>
    await getTime(time, 'With')
  ));
}

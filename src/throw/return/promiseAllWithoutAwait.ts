import { sleep } from '../sleep';

export async function getTime(ms: number, funName='') {
  await sleep(ms);
  if(!ms || ms >= 10_000) {
    throw Error (`getTime 호출이 실패했다 ms=${ms}, funName=${funName}`);
  }
  return {ms: ms}
}
export async function promiseAllWithoutAwait() {
  console.log('Without Await');
  const times = [1_000, 2_000, 10_000];

  return Promise.all(times.map(time =>
    getTime(time, 'Without')
  ));
}

export async function promiseAllWithAwait() {
  console.log('With Await');
  const times = [1_000, 2_000, 10_000];

  return Promise.all(times.map(async time =>
    await getTime(time, 'With')
  ));
}

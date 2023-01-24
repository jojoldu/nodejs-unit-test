import { sleep } from '../sleep';

export async function getTime(ms: number, funName = '') {
  await sleep(ms);
  if (!ms || ms >= 5_000) {
    throw Error(`getTime 호출이 실패했다 ms=${ms}, funName=${funName}`);
  }
  return {ms: ms}
}

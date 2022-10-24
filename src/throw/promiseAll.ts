import { sleep } from './sleep';

export async function getUser(id) {
  await sleep(10);
  if(!id) {
    throw Error ('getUser 호출이 실패했다')
  }
  return {id}
}

export function nameSyncBy (id) {
  return getUser(id);
}

export async function nameAsyncBy(id) {
  return await getUser(id);
}

import { sleep } from '../sleep';

export async function returnWithAwait() {
  return await throwAsync('with await');
}

async function throwAsync(msg) {
  await sleep(10);
  throw Error(msg);
}

async function passAsync (msg) {
  return await throwAsync(msg)
}

async function returnAndPassWithAwait (msg) {
  return await passAsync(msg);
}

export async function returnWithAwaitAndSync() {
  return await throwAsyncWithSync('with await');
}

async function throwAsyncWithSync(msg) {
  await sleep(10);
  sync(msg);
}

function sync(msg) {
  throw Error(msg);
}

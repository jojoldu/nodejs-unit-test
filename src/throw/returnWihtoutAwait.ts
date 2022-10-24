import { sleep } from './sleep';

export async function returnWithoutAwait() {
  return throwAsync('without await');
}

async function throwAsync(msg) {
  await sleep(10);
  throw Error(msg);
}

export async function returnWithoutAwaitAndSync() {
  return throwAsyncWithSync('without await');
}

async function throwAsyncWithSync(msg) {
  await sleep(10);
  sync(msg);
}

function sync(msg) {
  throw Error(msg);
}

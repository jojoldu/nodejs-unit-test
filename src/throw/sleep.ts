export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function sleepAndReturnTime(ms: number) {
  await sleep(ms);
  return ms;
}

export let mockDatabase = [];

export function clear() {
  mockDatabase = [];
}

export function count() {
  return mockDatabase.length;
}

export async function insert(ms: number) {
  await sleep(ms);
  mockDatabase.push(ms);
  return ms;
}

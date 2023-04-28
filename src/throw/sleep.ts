export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function sleepAndReturnTime(ms: number) {
  await sleep(ms);
  return ms;
}
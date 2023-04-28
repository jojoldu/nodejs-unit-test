import { sleep } from '../throw/sleep';

export async function run() {
  const promises = Array.from({length: 1000}, () => sleep(getRandomTime(500, 3000)));
  const startTime = performance.now();
  await Promise.all(promises);
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  console.log(`Total time elapsed: ${elapsedTime} ms`);
}

function getRandomTime(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
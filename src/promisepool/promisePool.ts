import { sleep } from '../throw/sleep';
import _ from 'lodash';
import { PromisePool } from '@supercharge/promise-pool';

export async function measure() {
  const chunkSize = 100;
  const times = Array.from({length: 1000}, () => getRandomTime(300, 2000));
  await measurePromiseAll(times, chunkSize);
  await measurePromisePool(times, chunkSize);
}

async function measurePromiseAll(times: number[], chunkSize: number) {
  const promises = times.map(time => sleep(time));
  const chunkAll = _.chunk(promises, chunkSize);
  const startTime = performance.now();

  for (const chunk of chunkAll) {
    await Promise.all(chunk);
  }

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  console.log(`PromiseAll Total time elapsed: ${elapsedTime} ms`);
}

async function measurePromisePool(times: number[], chunkSize: number) {
  const startTime = performance.now();

  const { results, errors } = await PromisePool
    .for(times)
    .withConcurrency(chunkSize)
    .process(sleep);

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  console.log(`PromisePool Total time elapsed: ${elapsedTime} ms`);
}

function getRandomTime(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
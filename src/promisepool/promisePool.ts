import { clear, count, insert, sleep } from '../throw/sleep';
import _ from 'lodash';
import { PromisePool } from '@supercharge/promise-pool';

export async function measure(chunkSize = 100) {
  const times = Array.from({length: 1000}, () => getRandomTime(500, 2000));
  await measurePromiseAll(times, chunkSize);
  await measurePromisePool(times, chunkSize);
}

async function measurePromiseAll(times: number[], chunkSize: number) {
  clear();
  const chunkAll = _.chunk(times, chunkSize);
  console.log(`chunkAll.length: ${chunkAll.length}, chunk.length: ${chunkAll[0].length}`);
  const startTime = performance.now();

  for (const chunk of chunkAll) {
    console.log(`max time: ${Math.max(...chunk)}`);
    await Promise.all(chunk.map(time => insert(time)));
  }

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  console.log(`PromiseAll Total time elapsed: ${elapsedTime/1000} s, count: ${count()})`);
}

async function measurePromisePool(times: number[], chunkSize: number) {
  clear();
  const startTime = performance.now();

  const { results, errors } = await PromisePool
    .for(times)
    .withConcurrency(chunkSize)
    .process(insert);

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  console.log(`PromisePool Total time elapsed: ${elapsedTime/1000} s, count: ${count()})`);
}

function getRandomTime(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

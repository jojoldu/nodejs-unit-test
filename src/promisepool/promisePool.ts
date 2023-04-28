import { sleep } from '../throw/sleep';

export function run() {
  const promises: Promise<void>[] = Array.from({ length: 1000 }, () => sleep(getRandomTime(500, 3000)));
}

function getRandomTime(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
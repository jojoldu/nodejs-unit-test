import { sleep } from '../throw/sleep';

export function run() {
  const promises: Promise<void>[] = Array.from({ length: 1000 }, (_, i) => sleep(i));
}
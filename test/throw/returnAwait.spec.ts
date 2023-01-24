import { returnWithAwait, returnWithAwaitAndSync } from "../../src/throw/return/returnWithAwait";
import { returnWithoutAwait, returnWithoutAwaitAndSync } from "../../src/throw/return/returnWihtoutAwait";
import { getUser, nameAsyncBy, nameSyncBy } from '../../src/throw/return/promiseAll';
import { sleep } from '../../src/throw/sleep';
import { promiseAllWithAwait, promiseAllAwait } from '../../src/throw/return/promiseAllAwait';

describe('with Await or without Await', () => {
  describe('Example 1', () => {
    it('returnWithAwait', () => {
      returnWithAwait();
    });

    it('returnWithoutAwait', () => {
      returnWithoutAwait();
    });
  });

  describe('Example 2', () => {
    it('returnWithAwaitAndSync', () => {
      returnWithAwaitAndSync();
    });

    it('returnWithoutAwaitAndSync', () => {
      returnWithoutAwaitAndSync();
    });
  });

  describe('Example 3. Promise.all', () => {
    describe('Example 3-1. Anonymous', () => {
      it('Promise.all & Sync', () => {
        const userIds = [1, 2, 0, 3]

        Promise.all(userIds.map(getUser)).catch(console.log);
      });

      it('Promise.all & Await', () => {
        const userIds = [1, 2, 0, 3]

        Promise.all(userIds.map(async id => await getUser(id))).catch(console.log);
      });
    });

    describe('Example 3-2. Named Function', () => {
      it('Promise.all & Sync', () => {
        const userIds = [1, 2, 0, 3]

        Promise.all(userIds.map(nameSyncBy)).catch(console.log);
      });

      it('Promise.all & Await', () => {
        const userIds = [1, 2, 0, 3]

        Promise.all(userIds.map(nameAsyncBy)).catch(console.log);
      });
    });
  });

  describe('Example 4. Promise Chaining', () => {
    it('Promise Chaining With Sync', async () => {
      await sleep(10)
        .then(() => sleep(5))
        .then(() => sleep(3))
        .then(() => sleep(0));
    });

    it('Promise Chaining With Async', async () => {
      await sleep(10)
        .then(async () => await sleep(5))
        .then(async () => await sleep(3))
        .then(async () => await sleep(0));
    });
  });

  describe('Example 5. Promise', () => {
    it('without await', async () => {
      await promiseAllAwait().catch(console.log);
    });

    it('with await', async () => {
      await promiseAllWithAwait().catch(console.log);
    });
  })
});

import { returnWithAwait, returnWithAwaitAndSync } from "../../src/throw/returnWithAwait";
import { returnWithoutAwait, returnWithoutAwaitAndSync } from "../../src/throw/returnWihtoutAwait";
import { getUser, nameAsyncBy, nameSyncBy } from '../../src/throw/promiseAll';

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

  describe('Example 3 - Promise.all', () => {
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
});

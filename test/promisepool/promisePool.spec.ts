import { measure } from '../../src/promisepool/promisePool';

describe('Promise.all vs PromisePool', () => {
  it('should be faster than Promise.all', async () => {
    // Arrange
    await measure(100);

  });
});
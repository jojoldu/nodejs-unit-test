import { returnWithAwait, returnWithAwaitAndSync } from "../../src/throw/returnWithAwait";
import { returnWithoutAwait, returnWithoutAwaitAndSync } from "../../src/throw/returnWihtoutAwait";

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
});

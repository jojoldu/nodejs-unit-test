import { returnWithAwait } from "../../src/throw/returnAwait";
import { returnWithoutAwait } from "../../src/throw/returnFunc";

describe('with Await or without Await', () => {
  it('returnWithAwait', () => {
    returnWithAwait();
  });

  it('returnWithoutAwait', () => {
    returnWithoutAwait();
  });
});
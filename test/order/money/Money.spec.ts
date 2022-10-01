import { Money } from '../../../src/order/money/Money';

describe('Money', () => {
  it('음수가 들어오면 에러가 발생한다', () => {
    const amount = -1;

    expect(() => {
      new Money(amount);
    }).toThrowError(new Error('금액은 -가 될 수 없습니다. amount=-1'));
  });

  it('소수점이 들어오면 에러가 발생한다', () => {
    const amount = 0.1;

    expect(() => {
      new Money(amount);
    }).toThrowError(new Error('금액은 정수만 가능합니다. amount=0.1'));
  });
});

export class Money {

  private readonly _amount: number;

  constructor(amount: number) {
    this._amount = amount;
    this.validatePositive();
    this.validateInteger();
  }

  private validatePositive() {
    if(this._amount < 0) {
      throw new Error(`금액은 -가 될 수 없습니다. amount=${this._amount}`);
    }
  }

  private validateInteger() {
    if(!Number.isInteger(this._amount)) {
      throw new Error(`금액은 정수만 가능합니다. amount=${this._amount}`);
    }
  }

  get amount(): number {
    return this._amount;
  }
}

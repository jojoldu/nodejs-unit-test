export function validateMoney(amount: number) {
  validatePositive(amount);
  validateInteger(amount);
}

function validatePositive(amount: number) {
  if(amount < 0) {
    throw new Error(`금액은 -가 될 수 없습니다. amount=${amount}`);
  }
}

function validateInteger(amount: number) {
  if(!Number.isInteger(amount)) {
    throw new Error(`금액은 정수만 가능합니다. amount=${amount}`);
  }
}

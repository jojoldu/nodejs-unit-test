export function validateOrder(amount: number, description: string) {
  validateAmount(amount);
  validateDescription(description);
}

function validateAmount(amount: number) {
  if(amount < 0) {
    throw new Error(`주문시 -금액은 될 수 없습니다. amount=${amount}`);
  }
}

function validateDescription(description: string) {
  if(!description) {
    throw new Error(`주문명은 필수입니다.`);
  }
}

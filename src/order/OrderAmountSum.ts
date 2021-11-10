export class OrderAmountSum {
    minusSum: number = 0;
    plusSum: number = 0;

    constructor(amounts: number[]) {
        this.addPlusAmounts(amounts);
        this.addMinusAmounts(amounts);
    }

    get sumAmount(): number {
        return this.plusSum + this.minusSum;
    }

    private addPlusAmounts(amounts: number[]): void {
        this.plusSum = amounts
            .filter(amount => amount > 0)
            .reduce((before, current) => before + current);
    }

    private addMinusAmounts(amounts: number[]): void {
        this.minusSum = amounts
            .filter(amount => amount < 0)
            .reduce((before, current) => before + current);
    }
}

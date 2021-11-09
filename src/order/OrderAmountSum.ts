export class OrderAmountSum {
    minusSum: number = 0;
    plusSum: number = 0;
    amounts: number[];

    constructor(amounts: number[]) {
        this.amounts = amounts;
        this.addPlusAmounts(amounts);
        this.addMinusAmounts(amounts);
    }

    get sumAmount(): number {
        return this.plusSum + this.minusSum;
    }

    get sumAmount2(): number {
        return this.amounts
            .reduce((before, current) => before + current);
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

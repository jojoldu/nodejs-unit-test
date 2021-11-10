export class OrderAmountSum2 {
    amounts: number[];

    constructor(amounts: number[]) {
        this.amounts = amounts;
    }

    get sumAmount(): number {
        return this.amounts
            .reduce((before, current) => before + current);
    }

}

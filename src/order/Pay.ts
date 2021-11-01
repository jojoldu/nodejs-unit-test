export class Pay {
    private _amount: number;
    private _name: string;

    constructor() {
    }

    get amount(): number {
        return this._amount;
    }

    get name(): string {
        return this._name;
    }
}

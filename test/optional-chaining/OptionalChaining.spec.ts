describe('Optional chaining', () => {
    it('?가 있는 경우 #1', () => {
        const amount = 0;
        const sut = createOrder(amount);

        expect(sut?.pay?.amount).toBe(amount);
    });

    it('?가 있는 경우 #2', () => {
        const amount = -100;
        const sut = createOrder(amount);

        expect(sut?.pay?.amount).toBe(amount);
    });

    it('?가 없는 경우', () => {
        const amount = 0;
        const sut = createOrder(amount);

        expect(sut.pay.amount).toBe(amount);
    });

    it('?가 없는 경우 #2', () => {
        const amount = -100;
        const sut = createOrder(amount);

        expect(sut.pay.amount).toBe(amount);
    });
});

function createOrder(amount?) {
    if(amount < 0) {
        return undefined;
    }

    return new Order(amount);
}

class Order {
    pay;

    constructor(amount?) {
        if(amount) {
            this.pay = {
                amount,
            }
        }
    }
}

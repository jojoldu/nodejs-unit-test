# 테스트코드에서 Optional chaining(?.) 금지

```ts
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

```

```ts
    it('?가 없는 경우 #1', () => {
        const amount = 0;
        const sut = createOrder(amount);

        expect(sut.pay.amount).toBe(amount);
    });

    it('?가 없는 경우 #2', () => {
        const amount = -100;
        const sut = createOrder(amount);

        expect(sut.pay.amount).toBe(amount);
    });
```

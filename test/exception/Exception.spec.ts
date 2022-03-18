describe('Exception', () => {
    describe('1. 의도한 대로 수행되는 테스트', () => {
        it("[try/catch] 주문금액이 -이면 BadParameter Exception 을 던진다.", async () => {
            try {
                await acceptOrder1({amount: -1000});
            } catch (e) {
                expect(e).toBeInstanceOf(BadParameterException);
                expect(e.message).toBe('승인 요청 주문의 금액은 -가 될 수 없습니다');
            }
        });

        it("[expect] 주문금액이 -이면 BadParameter Exception 을 던진다.", async () => {
            await expect(async () => {
                await acceptOrder({amount: -1000});
            }).rejects.toThrowError(new BadParameterException('승인 요청 주문의 금액은 -가 될 수 없습니다'));
        });
    });

    describe('2. 에러가 발생하지 않을때를 대비한 경우', () => {
        it('[try/catch] 주문금액이 -이면 BadParameter Exception 을 던진다.', async () => {
            let errorWeExceptFor = null;
            try {
                await acceptOrder1({amount: -1000});
            } catch (e) {
                expect(e).toBeInstanceOf(BadParameterException);
                expect(e.message).toBe('승인 요청 주문의 금액은 -가 될 수 없습니다');
                errorWeExceptFor = e;
            }

            expect(errorWeExceptFor).not.toBeNull();
        });

        it("[try/catch & fail] 주문금액이 -이면 BadParameter Exception 을 던진다.", async() => {
            try {
                await acceptOrder1({amount: -1000});
                throw new Error('it should not reach here');
            } catch (e) {
                expect(e.message).toBe('승인 요청 주문의 금액은 -가 될 수 없습니다');
                expect(e).toBeInstanceOf(BadParameterException);
            }
        });

        it("[expect] 주문금액이 -이면 BadParameter Exception 을 던진다.", async () => {
            await expect(async () => {
                await acceptOrder1({amount: -1000});
            }).rejects.toThrowError(new BadParameterException('승인 요청 주문의 금액은 -가 될 수 없습니다'));
        });
    });

    describe('3. 의도한 에러가 아닌 다른 에러가 발생한 경우', () => {

        it("[try/catch] 주문금액이 -이면 BadParameter Exception 을 던진다.", async() => {
            try {
                await acceptOrder2({amount: -1000});
            } catch (e) {
                expect(e).toBeInstanceOf(BadParameterException);
                expect(e.message).toBe('승인 요청 주문의 금액은 -가 될 수 없습니다');
            }

            throw new Error('it should not reach here');
        });

        it("[expect] 주문금액이 -이면 BadParameter Exception 을 던진다.", async() => {
            await expect(async () => {
                await acceptOrder2({amount: -1000});
            }).rejects.toThrowError(new BadParameterException('승인 요청 주문의 금액은 -가 될 수 없습니다'));
        });
    });

});

 async function acceptOrder(order): Promise<void> {
    if(order.amount < 0) {
        throw new BadParameterException('승인 요청 주문의 금액은 -가 될 수 없습니다');
    }
}

async function acceptOrder1(order): Promise<void> {
}

async function acceptOrder2(order): Promise<void> {
    throw new Error('무조건 에러 발생');
}

// @ts-ignore
class Order {
    private orderNo: string;
    private amount: number;
}

class BadParameterException extends Error {
    constructor(message: string) {
        super(message);
    }
}

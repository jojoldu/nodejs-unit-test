describe('Exception', () => {
    it("[try/catch] 주문금액이 -이면 BadParameter Exception 을 던진다.", async() => {
        let errorWeExceptFor = null;
        try {
            await acceptOrder1({orderNo:'FX01B81'});
        } catch (e) {
            expect(e).toBeInstanceOf(BadParameterException);
            expect(e.message).toBe('승인 요청 주문의 금액은 -가 될 수 없습니다');
            errorWeExceptFor = e;
        }

        expect(errorWeExceptFor).toBeNull();
    });

    it("[try/catch] 주문금액이 -이면 BadParameter Exception 을 던진다.", async() => {
        try {
            await acceptOrder1({orderNo:'FX01B81'});
            fail('not reach');
        } catch (e) {
            expect(e).toBeInstanceOf(BadParameterException);
            expect(e.message).toBe('승인 요청 주문의 금액은 -가 될 수 없습니다');
        }
    });

    it("[expect] 주문금액이 -이면 BadParameter Exception 을 던진다.", async() => {
        await expect(acceptOrder1({orderNo: 'FX01B81'}))
          .rejects
          .toThrow(BadParameterException);
    });
});

async function acceptOrder1(order): Promise<void> {
}

async function acceptOrder2(order): Promise<void> {
    if(order.amount < 0) {
        throw new BadParameterException('승인 요청 주문의 금액은 -가 될 수 없습니다');
    }
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

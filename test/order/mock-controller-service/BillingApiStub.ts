import { Order } from '../../../src/order/Order';
import { BillingApi } from '../../../src/order/BillingApi';

export class BillingApiStub extends BillingApi {
    _billingStatus: string;
    _completedOrder: Order;
    _canceledOrder: Order;

    constructor(billingStatus: string) {
        super();
        this._billingStatus = billingStatus;
    }

    getBillingStatus(orderId: number): string {
        return this._billingStatus;
    }

    complete(order: Order): void {
        this._completedOrder = order;
    }

    cancel(order: Order): void {
        this._canceledOrder = order;
    }
}

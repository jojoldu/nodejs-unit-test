import { Order } from '../../../src/order/Order';
import { BillingApi } from '../../../src/order/BillingApi';

export class BillingApiStub extends BillingApi {
    billingStatus: string;
    completedOrder: Order;
    canceledOrder: Order;

    constructor(billingStatus: string) {
        super();
        this.billingStatus = billingStatus;
    }

    getBillingStatus(orderId: number): string {
        return this.billingStatus;
    }

    complete(order: Order): void {
        this.completedOrder = order;
    }

    cancel(order: Order): void {
        this.canceledOrder = order;
    }
}

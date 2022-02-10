import { Order } from './Order';

export class BillingApi {
    getBillingStatus(orderId: number): string {
        return "COMPLETE";
    }


    complete (order: Order): void {

    }

    cancel (order: Order): void {

    }
}

import { OrderStatus } from './OrderStatus';

export class OrderCreateReq {
    private _amount: number;
    private _status: OrderStatus;
    private _description: string;

    constructor(amount: number, status: OrderStatus, description: string) {
        this._amount = amount;
        this._status = status;
        this._description = description;
    }

    validate() {
        this.validateApproval();
        this.validateCancel();
    }

    validateApproval() {
        if(this._status == OrderStatus.APPROVAL && this._amount < 0) {
            throw new Error(`주문요청일때는 금액이 0원 미만일 수 없습니다.`);
        }
    }

    validateCancel() {
        if(this._status == OrderStatus.CANCEL && this._amount >= 0) {
            throw new Error(`주문취소일때는 금액이 0원 이상일 수 없습니다.`);
        }
    }
}

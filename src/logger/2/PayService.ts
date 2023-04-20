import { log } from '../log';
import { payRepository } from './payRepository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PayService {
  async cancel(orderNo) {
    try {
      return payRepository.cancelOrder(orderNo);
    } catch (e) {
      log.error(`주문취소 실패, orderNo=${orderNo}`, e);
      throw new Error(`주문취소 실패, orderNo=${orderNo}`);
    }
  }

  async cancel2(orderNo) {
    try {
      return payRepository.cancelOrder(orderNo);
    } catch (e) {
      log.error(`주문취소 실패, orderNo=${orderNo}`, e);
      throw new Error(`주문취소 실패, orderNo=${orderNo}`);
    }
  }
}


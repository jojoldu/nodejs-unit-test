import { log } from '../../log';
import { orderRepository } from '../orderRepository';

export async function cancelOrder(orderNo) {
  try {
    return orderRepository.cancelOrder(orderNo);
  } catch (e) {
    log.error(`주문취소 실패, orderNo=${orderNo}`, e);
    throw new Error(`주문취소 실패, orderNo=${orderNo}`);
  }
}

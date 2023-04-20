
export const payRepository = {
  cancelOrder: (orderNo: string) => {
    return Promise.reject(() => new Error('해당하는 주문 정보가 없습니다.'));
  }
}

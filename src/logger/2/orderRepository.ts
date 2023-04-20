
export const orderRepository = {
  cancelOrder: (orderNo: string) => {
    return Promise.resolve({
        orderNo,
    });
  }
}

import TestableRepository from './TestableRepository';
import Posts from './Posts';
import { Order }  from "../../src/order/Order";
import { LocalDateTime } from "js-joda";

export default class TestableService {
  constructor(private readonly repository: TestableRepository) {
    this.repository = repository;
  }

  public write(title: string, body: string) {
    return this.repository.write(
      new Posts(title, body, new Date()),
    );
  }

  public async acceptOrder(amount: number, description: string) {
    if(amount < 0) {
      throw new Error(`주문시 -금액은 될 수 없습니다. amount=${amount}`);
    }

    if(!description) {
      throw new Error(`주문명은 필수입니다.`);
    }

    const order = Order.create(amount, description, LocalDateTime.now());

    await this.repository.acceptOrder(order);
  }
}



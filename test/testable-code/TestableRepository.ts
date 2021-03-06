import Posts from './Posts';
import { Order } from 'src/order/Order';

export default class TestableRepository {
  constructor() {
  }

  async acceptOrder(order: Order): Promise<void> {
  }

  async write(posts: Posts): Promise<void> {
  }

  async recentItems(): Promise<string> {
    return this.query(`
        SELECT *
        FROM table
        WHERE created_at <= NOW() + INTERVAL '1 day';
    `);
  }

  query(sql: string): Promise<string> {
    console.log();
    return new Promise((resolve, reject) => {
        resolve(`성공: ${sql}`)
    });
  };
}

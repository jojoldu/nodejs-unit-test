import Posts from './Posts';
import Order from 'src/order/Order';

export default class TestableRepository {

  async acceptOrder(order: Order): Promise<void> {

  }

  write(posts: Posts): void {
  }

  recentItems():string {
    return query(`
      SELECT *
      FROM table
      WHERE created_at <= NOW()
    `);
  }
}

export function query(sql: string) {
  console.log(sql);
  return sql;
}
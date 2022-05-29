import Posts from './Posts';

export default class TestableRepository {

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
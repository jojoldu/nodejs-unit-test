import { QueryBuilder } from "./QueryBuilder";

export class BlogRepository {
  private queryBuilder: QueryBuilder;

  async getBlogs() {
    return this.queryBuilder.query(`
			SELECT *
			FROM blog
			WHERE publish_at <= NOW()
		`);
  }
}
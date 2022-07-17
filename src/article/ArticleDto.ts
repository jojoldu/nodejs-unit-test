import { Article } from './Article';

export class ArticleDto {
  private _id: number;
  private _title: string;
  private _content: string;
  private _publishedAt: string;

  constructor() {}

  static from (entity: Article) {
    const response = new ArticleDto();
    response._id = entity.id;
    response._title = entity.title;
    response._content = entity.content;
    response._publishedAt = entity.publishedAt.toISOString();
    return response;
  }
}

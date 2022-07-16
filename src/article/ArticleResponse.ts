import { Article } from './Article';

export class ArticleResponse {
  private _id: number;
  private _title: string;
  private _content: string;
  private _publishedAt: string;

  constructor() {}

  static from (entity: Article) {
    const response = new ArticleResponse();
    response._id = entity.id;
    response._title = entity.title;
    response._content = entity.content;
    return response;
  }
}

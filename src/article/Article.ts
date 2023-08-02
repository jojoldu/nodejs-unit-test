import {ArticleStatus} from "./ArticleStatus";
import title from "@faker-js/faker/locales/en/name/title";

export class Article {
  private _id: number;
  private _title: string;
  private _content: string;
  private _publishedAt: Date;
  private _status: ArticleStatus;

  constructor() {}

  of(id: number, title: string, content: string, publishedAt: Date): Article {
    this._id = id;
    this._title = title;
    this._content = content;
    this._publishedAt = publishedAt;
    return this;
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get publishedAt(): Date {
    return this._publishedAt;
  }

  get status(): ArticleStatus {
    return this._status;
  }
}

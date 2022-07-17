export class Article {
  private _id: number;
  private _title: string;
  private _content: string;
  private _publishedAt: Date;

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

}

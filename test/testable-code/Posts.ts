export default class Posts {
  private title: string;
  private body: string;
  private publishedAt: Date;

  constructor(title: string, body: string, publishedAt: Date) {
    this.publishedAt = publishedAt;
    this.body = body;
    this.title = title;
  }
}

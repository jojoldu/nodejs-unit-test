import { ArticleDto } from "./ArticleDto";

export default class ArticleService {

  async findById (id: number): Promise<ArticleDto> {
    return new ArticleDto();
  }
}
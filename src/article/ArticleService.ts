import { ArticleDto } from "./ArticleDto";
import {Article} from "./Article";

export default class ArticleService {


  async findById (id: number): Promise<ArticleDto> {
    return new ArticleDto();
  }

  async create (userId: number, content: string) : Promise<Article> {
    return new Promise(() => new Article());
  }
}

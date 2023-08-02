import ArticleService from "../../src/article/ArticleService";
import {ArticleStatus} from "../../src/article/ArticleStatus";

async function createLimitOverUser(): Promise<number> {
    return new Promise(() => 1);
}

describe('ArticleService', () => {
    const sut = new ArticleService();

    describe('create', () => {
        it('하루 글쓰기 횟수가 초과한 사용자가 작성할 경우, 작성된 글은 PENDING 상태가 된다.', async () => {
            const limitOverUserId = await createLimitOverUser();

            const article = await sut.create(limitOverUserId, '게시글');

            expect(article.status).toBe(ArticleStatus.PENDING);
        });
    });
});

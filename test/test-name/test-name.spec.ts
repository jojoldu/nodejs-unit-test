import ArticleService from "../../src/article/ArticleService";
import {ArticleStatus} from "../../src/article/ArticleStatus";
import {PointService} from "../../src/point/PointService";

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


async function fixturePoint(userId: any, remainPoint: any) {

}

describe('PointService', () => {
    const sut = new PointService();
    describe('use', () => {
        it('잔액 포인트가 부족하면 결제가 거부된다', async () => {
            const userId = 1;
            const remainPoint = 900;
            await fixturePoint(userId, remainPoint);

            await expect(async () => {
                const usePoint = 1000;
                await sut.use(userId, usePoint);
            }).rejects.toThrowError(new BadParameterException('결제 금액은 잔액 포인트를 초과할 수 없습니다.'));
        });
    });
});

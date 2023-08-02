# 비즈니스 내용을 테스트 메소드명으로 사용하기


- 테스트 대상
- 어떤 상황에서
- 예상되는 결과


```ts
// bad
describe('ArticleService', () => {
    describe('create', () => {
        it('PENDING status', async () => {
            const limitOverUserId = await createLimitOverUser();

            const article = await sut.create(limitOverUserId, '게시글');

            expect(article.status).toBe(ArticleStatus.PENDING);
        });
    });
});
```

```ts
// good
describe('ArticleService', () => {
    describe('create', () => {
        it('하루 글쓰기 횟수가 초과한 사용자가 작성할 경우, 작성된 글은 PENDING 상태가 된다.', async () => {
            const limitOverUserId = await createLimitOverUser();

            const article = await sut.create(limitOverUserId, '게시글');

            expect(article.status).toBe(ArticleStatus.PENDING);
        });
    });
});
```
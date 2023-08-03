# 비즈니스 내용을 테스트 메소드명으로 사용하기


- 테스트 대상
- 어떤 상황에서
- 예상되는 결과

가독성 증가: 테스트 메소드의 이름이 비즈니스 요구사항을 반영하면, 코드를 읽는 사람들이 해당 테스트가 어떤 비즈니스 케이스를 확인하고 있는지 더 쉽게 이해할 수 있다.

문서화의 일부로 작용: 테스트 메소드의 이름이 비즈니스 요구사항을 명확히 반영하면, 해당 테스트 코드는 실제 비즈니스 로직이 어떻게 작동해야 하는지에 대한 간결한 문서 역할을 할 수 있다.

유지보수 용이: 테스트가 비즈니스 로직을 명확히 반영하면, 나중에 요구사항이 변경되거나 코드가 수정될 때 해당 테스트가 어떤 부분을 검증하고 있는지 파악하기 쉽다. 이로 인해 유지보수가 간편하다.

에러 추적 용이: 테스트가 실패할 경우, 테스트 메소드의 이름이 비즈니스 내용을 반영하고 있으면 어떤 비즈니스 요구사항이 만족되지 않았는지를 빠르게 파악할 수 있어 디버깅 시간을 절약할 수 있다.

비즈니스 요구사항과 개발의 연계: 이 방식은 개발자와 비즈니스 이해관계자 사이의 커뮤니케이션을 강화하며, 개발이 비즈니스 목표와 밀접하게 연계되도록 할 수 있다.

예를 들어, "사용자가_잔액이_부족하면_결제가_거부됨"과 같은 메소드 이름은 해당 테스트가 어떤 상황을 검증하고 있는지 명확하게 보여준다.

그러나 테스트 메소드명을 길게 작성해야 할 수도 있어 일부 개발자들은 이를 복잡하다고 느낄 수 있으며, 이름만으로 모든 비즈니스 로직을 반영하기 어려울 수도 있기 때문에, 적절한 주석과 문서화와 함께 사용하는 것이 좋을 수 있다.

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
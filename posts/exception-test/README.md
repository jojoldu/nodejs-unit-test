# catch 보다는 expect

```ts
it("제품명이 없으면 400 오류를 던진다.", async() => {
  let errorWeExceptFor = null;
  try {
    const result = await addNewProduct({name:'nest'});}
  catch (error) {
    expect(error.code).to.equal('InvalidInput');
    errorWeExceptFor = error;
  }
  expect(errorWeExceptFor).not.to.be.null;
  // 이 asserting이 실패하면, 테스트 결과에서 누락된 입력값에 대한 단어는 알 수 없고
  // 입력값이 null 이라는 것만 알 수 있습니다.
});
```

**chai.js** 사용할 경우

```ts
it.only("제품명이 없으면 400 오류를 던진다.", async() => {
  expect(addNewProduct)).to.eventually.throw(AppError).with.property('code', "InvalidInput");
});
```

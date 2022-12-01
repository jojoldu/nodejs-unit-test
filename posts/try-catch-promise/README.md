# try-catch와 Promise

```ts
const promise = Promise.resolve();

promise.then(() => sleep("프라미스 성공!"));

sleep("코드 종료");
```

```ts
Promise.resolve()
  .then(() => sleep("프라미스 성공!"))
  .then(() => sleep("코드 종료"));
```
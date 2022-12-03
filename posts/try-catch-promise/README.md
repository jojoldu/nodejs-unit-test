# try-catch와 Promise

일반적으로 애플리케이션 코드에서 예외처리를 하면 `try ~ catch`를 사용한다.

> 아래 코드는 NestJS와 같은 프레임워크를 기준으로 했다.




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
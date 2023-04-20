# 2. 효율적으로 로그 모니터링하기 - 중복 로그 남기지 않기

```ts
export function cancelOrder(data: Data) {
    try {
        return someService.doSomething(data);
    } catch (e) {
        log.error("Error occurred. Data - {}", data, ex);
        throw new AnotherCommonException("Some error occurred");
    }
}
```

```ts
export function cancelOrder(data: Data) {
    try {
        return someService.doSomething(data);
    } catch (e) {
        throw new AnotherCommonException("Some error occurred", e);
    }
}
```

# 2. 테스트하기 좋은 코드


```ts
public async acceptOrder(amount: number, description: string) {
  if(amount < 0) {
    throw new Error(`주문시 -금액은 될 수 없습니다. amount=${amount}`);
  }

  if(!description) {
    throw new Error(`주문명은 필수입니다.`);
  }

  const order = Order.create(amount, LocalDateTime.now(), description);

  await this.repository.acceptOrder(order);
}
```

여기서 테스트를 어렵게 만드는 부분은 2군데이다.

* `Order.create(amount, LocalDateTime.now(), description)`
* `await this.repository.acceptOrder(order)`

이 둘이 테스트

## 테스트 하기 좋은 코드로 리팩토링

흔히 말하는 Controller-Service-Repository 패턴이라면 Repository 가 

실제로는 Controller -> Service -> Domain <- Repository 가 된다.
즉, 

### BE

DB에서 값을 가져오는 코드

### FE

Cookie 나 로컬 스토리지를 통해 값을 가져오는 코드

## 

다음과 같이 시그널을 캐치할 수 있다.

> private 메소드가 많다면 클래스로 분리하는 것을 고려해보자


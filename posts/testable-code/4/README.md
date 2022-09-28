# 4. 테스트하기 좋은 코드 - 검증이 필요한 private 함수


## Service 로직일 경우

만약 다음과 같이 **도메인 로직이 아닌 서비스 로직일 경우**에는 어떻게 하는 것이 좋을까?  

```ts
async receipt(amount: number, description: string) {
  if(amount < 0) {
    throw new Error(`주문시 -금액은 될 수 없습니다. amount=${amount}`);
  }

  if(!description) {
    throw new Error(`주문명은 필수입니다.`);
  }

  const order = Order.create(amount, description);

  await this.orderRepository.save(order);
}
```

다만 이럴경우 `validation` 메소드는 보통 `private` 메소드로 만드는데,  
테스트를 위해 `public` 메소드를 만들어야만 한다.  
그게 아니라면 **private 메소드를 테스트**해야만 한다.

이 테스트는 왜 테스트 작성이 너무나 어려운것일까?

* 실행할때마다 변경되는 현재 시간 쿼리 함수 (`NOW()`) 를 쿼리 내부에서 쓰고 있다

* 현재 테스트로 사용중인 데이터베이스에

## 

다음과 같이 시그널을 캐치할 수 있다.

> private 메소드가 많다면 클래스로 분리하는 것을 고려해보자



## Service 로직일 경우

만약 다음과 같이 **도메인 로직이 아닌 서비스 로직일 경우**에는 어떻게 하는 것이 좋을까?  

```ts
async receipt(amount: number, description: string) {
  if(amount < 0) {
    throw new Error(`주문시 -금액은 될 수 없습니다. amount=${amount}`);
  }

  if(!description) {
    throw new Error(`주문명은 필수입니다.`);
  }

  const order = Order.create(amount, description);

  await this.orderRepository.save(order);
}
```

다만 이럴경우 `validation` 메소드는 보통 `private` 메소드로 만드는데,  
테스트를 위해 `public` 메소드를 만들어야만 한다.  
그게 아니라면 **private 메소드를 테스트**해야만 한다.


여기서 테스트를 어렵게 만드는 부분은 2군데이다.

* `Order.create(amount, LocalDateTime.now(), description)`
* `await this.repository.acceptOrder(order)`

이 둘이 테스트

테스트 하기 어려운 코드들은 최대한 한 곳에서 관리하고,  
이 코드들이 전파되지 않도록 해야한다.

```ts
export class Order {
  ...
    static create(amount: number, description: string, orderTime = LocalDateTime.now()): Order {
        if(amount < 0) {
            throw new Error(`주문시 -금액은 될 수 없습니다. amount=${amount}`);
        }

        if(!description) {
            throw new Error(`주문명은 필수입니다.`);
        }

        const newOrder = new Order();
        newOrder._amount = amount;
        newOrder._status = OrderStatus.REQUEST;
        newOrder._orderDateTime = orderTime;
        newOrder._description = description;
        return newOrder;
    }
}
```

```ts
async receipt(amount: number, description: string) {
  const order = Order.create(amount, description);

  await this.orderRepository.save(order);
}
```

```ts
it('주문 벨리데이션', () => {
  const sut = Order.create(10_000, 'description');

  expect(sut.amount).toBe(10_000);
});
```
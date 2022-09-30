# 4. 테스트하기 좋은 코드 - 검증이 필요한 private 함수

지난 시간까지 테스트하기 어려운 코드를 어떻게 개선하면 좋을지에 대해 이야기를 나눴다.

[1. 테스트하기 어려운 코드](https://jojoldu.tistory.com/674)  
[2. 제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)  
[3. 외부에 의존하는 코드 개선](https://jojoldu.tistory.com/680)  
  
앞의 글의 결론은 간단하다.  
**테스트 하기 어려운 코드와 테스트하기 쉬운 코드를 분리하되,  
테스트 하기 어려운 코드는 최대한 바깥으로 몰아넣는다**.  
  
전체적인 방향성은 위와 같이 유지하되, 이번에는 조금 더 세밀한 내용을 보자.  
비즈니스 로직을 작성하다보면 무수한 `private` 메소드/함수들을 생성하게 된다.  
이전 글에서도 언급했지만, `private` 메소드/함수는 최대한 검증하지 않는 것이 좋다.  
  
* [테스트 코드에서 내부 구현 검증 피하기](https://jojoldu.tistory.com/614)

그럼에도 불구하고 `private` 메소드/함수를 검증해야할 경우가 있다.

* 테스트가 없는 기존 코드를 리팩토링 해야하는 경우
* `public` 메소드 안에 속해있지만, `private` 메소드/함수의 로직이 복잡해서 다양한 케이스를 검증해야하는 경우

그럼 이런 경우엔 어떻게 해야할까?  
메소드/함수의 범위를 `public` 으로 변경해야할까?

## 4-1. 문제 상황

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

## 4-2. 해결 방법

해결책은 어떤 로직이냐에 따라 다르지만, 둘다 쉽다.  
  
* 해당 로직이 도메인과 관련된 로직이라면 도메인 클래스에 위임한다.
* 기존의 도메인과 무관한 로직이라면 비공개 메소드/함수 (`private`) 들을 도메인 기준에 맞춰 묶어서 `public` 함수 혹은 클래스로 추출한다.


## 

다음과 같이 시그널을 캐치할 수 있다.

* private 메소드/함수가 많다면 클래스/공개 함수로 분리하는 것을 고려해보자



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
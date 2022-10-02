# 4. 테스트하기 좋은 코드 - 검증이 필요한 private 함수

지난 시간까지 테스트하기 어려운 코드를 어떻게 개선하면 좋을지에 대해 이야기를 나눴다.

[1. 테스트하기 어려운 코드](https://jojoldu.tistory.com/674)  
[2. 제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)  
[3. 외부에 의존하는 코드 개선](https://jojoldu.tistory.com/680)  
  
지금까지 글들의 결론은 간단하다.  
  
**테스트 하기 어려운 코드와 테스트 하기 쉬운 코드를 분리하되,  
테스트 하기 어려운 코드는 최대한 바깥으로 몰아넣는다**.  
  
전체적인 방향성은 위와 같이 유지하되, 이번에는 조금 더 세밀한 내용을 보자.  
비즈니스 로직을 작성하다보면 무수히 많은 `private` 메소드/함수들을 생성하게 된다.  
이전 글에서도 언급했지만, **private 메소드/함수의 테스트 코드는 작성하지 않는 것이 좋을때가 많다**.  
  
* [테스트 코드에서 내부 구현 검증 피하기](https://jojoldu.tistory.com/614)

그럼에도 불구하고 `private` 메소드/함수를 검증해야할 경우가 있다.

* 테스트가 없는 기존 `private` 코드를 리팩토링 해야하는 경우
* 테스트하기 어려운 코드를 몰아넣은 Presentation (Controller, Handler 등), Service Infra 계층의 `private` 로직일 경우

그럼 이런 경우엔 어떻게 해야할까?  
해당 `private` 메소드/함수의 범위를 `public` 혹은 `protected` 등으로 변경해야할까?  
어떻게 할지 알아보자.

## 4-1. 문제 상황

만약 다음과 같이 HTTP API로 받은 **값들을 검증하고, DB에 저장하는** 코드가 있다고 해보자.

```ts
async receipt(amount: number, description: string) {
    if(amount < 0) {
        throw new Error(`금액은 -가 될 수 없습니다. amount=${amount}`);
    }

    if(!Number.isInteger(amount)) {
        throw new Error(`금액은 정수만 가능합니다. amount=${amount}`);
    }

    const order = Order.create(amount, description);

    await this.orderRepository.save(order);
}
```

이 코드를 리팩토링 한다면 보통 다음과 같다.

```ts
export class OrderService {
  async receipt(amount: number, description: string) {
      this.validatePositive(amount);
      this.validateInteger(amount);

      const order = Order.create(amount, description);

      await this.orderRepository.save(order);
  }

  private validatePositive(amount: number) {
    if(amount < 0) {
      throw new Error(`금액은 -가 될 수 없습니다. amount=${amount}`);
    }
  }

  private validateInteger(amount: number) {
    if(!Number.isInteger(amount)) {
      throw new Error(`금액은 정수만 가능합니다. amount=${amount}`);
    }
  }
}
```

리팩토링된 코드를 보면서 **어떻게 테스트 코드를 작성할지 고민해보자**.  
[앞서 소개한 글](https://jojoldu.tistory.com/680) 에서 나온것처럼 이 코드는 테스트 하기가 어렵다.  
  
테스트 하기 쉬운 코드 (`validate` 함수들)와 테스트 하기 어려운 코드 (데이터베이스를 사용하는 `async/await` 함수) 가 섞여있기 때문이다.  
  
이를 테스트 하기 위해서는 **테스트하기 쉬운 코드와 어려운 코드를 분리해야만 한다**.  
  
하지만 이미 서비스 인프라 계층에서 강하게 묶여있는 상황에서 어떻게 리팩토링 해야만 둘을 분리할 수 있을까?

## 4-2. 해결 방법

어떤 로직이냐에 따라 다르지만, 해결책은 크게 2가지가 있다.  
  
> 당연한 얘기이지만, `private` 메소드/함수는 **테스트 대상이 아닐 확률이 높다**.  
> 여기서 이야기하는 해결책은 어쩔수 없이 테스트가 필요한 경우를 의미한다.

### 해결책 1

해당 로직이 도메인과 관련된 로직이라면 **도메인 클래스에 위임**한다.  
  
예를 들어 이번 사례의 경우 테스트 코드로 검증하고자 하는 로직은 다음과 같다.

* 전달받은 주문금액은 **양수**여야 한다
* 전달받은 주문금액은 **양의 정수**여야 한다.

이 검증 로직을 **기존의 도메인 클래스**인 `Order` 에 위임한다.

```ts
export class Order {
  ...
    static create(amount: number, description: string, orderTime = LocalDateTime.now()): Order {
     
        if(amount < 0) {
          throw new Error(`금액은 -가 될 수 없습니다. amount=${amount}`);
        }

        if(!Number.isInteger(amount)) {
          throw new Error(`금액은 정수만 가능합니다. amount=${amount}`);
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

도메인 클래스에 위임할 경우 외부 의존성 (데이터베이스)에 의존하지 않기 때문에 테스트 코드 작성의 어려움이 해결된다.  
  
검증 로직이 도메인 `Order` 에 어울리는 로직이라면 이 방법이 유효하다.  
  
다만, 이 해결책을 사용할 수 없는 경우도 있따.  

* 검증하고자 하는 로직이 기존 도메인 로직에 담기에 모호하거나 여러 도메인이 공통적으로 필요로 하는 경우

이를테면 이번 같이 금액 검증 로직은 **Order 도메인에만 필요한 로직이 아니다**
Order (주문) 외에 Billing (결제), Settle (정산), Menu (메뉴) 등등 여러 도메인이 금액 검증 로직이 필요하다.  
  
이럴 경우엔 어떻게 하면 좋을까?  
금액 검증 로직을 상속으로 풀어야하는 것일까?  

### 해결책 2

이 경우 비공개 메소드/함수 (`private`) 들을 로직에 맞게 **공개 함수 혹은 클래스로 묶어서 추출**하는 방법이 있다.    
  
예를 들어 이번 테스트의 대상인 `금액 검증` 로직들은 도메인 측면에서 **금액 (Money)**에서 관리하도록 추출할 수 있다.

```ts
export class Money {

  private readonly _amount: number;

  constructor(amount: number) {
    this._amount = amount;
    this.validatePositive();
    this.validateInteger();
  }

  private validatePositive() {
    if(this._amount < 0) {
      throw new Error(`금액은 -가 될 수 없습니다. amount=${this._amount}`);
    }
  }

  private validateInteger() {
    if(!Number.isInteger(this._amount)) {
      throw new Error(`금액은 정수만 가능합니다. amount=${this._amount}`);
    }
  }

  get amount(): number {
    return this._amount;
  }
}
```

이렇게 `private` 메소드/함수를 묶은 클래스가 생김으로 **해당 로직들 역시 테스트가 쉬워진다**.

```ts
describe('Money', () => {
  it('음수가 들어오면 에러가 발생한다', () => {
    const amount = -1;

    expect(() => {
      new Money(amount);
    }).toThrowError(new Error('금액은 -가 될 수 없습니다. amount=-1'));
  });

  it('소수점이 들어오면 에러가 발생한다', () => {
    const amount = 0.1;

    expect(() => {
      new Money(amount);
    }).toThrowError(new Error('금액은 정수만 가능합니다. amount=0.1'));
  });
});
```
 
새롭게 추출된 Money 클래스로 인해서 기존의 서비스 인프라코드는 다음과 같이 개선될 수 있다.

```ts
export class OrderService {
  async receipt(amount: number, description: string) {
      const money = new Money(amount);
      const order = Order.create(money, description);

      await this.orderRepository.save(order);
  }
}
```

기존 도메인 클래스인 Order 에서는 Money 객체를 메소드의 파라미터로 혹은 멤버변수로 사용하면 된다.  
  
**메소드의 파라미터로 쓸 경우**

```ts
export class Order {
  ...
    static create(money: Money, description: string, orderTime = LocalDateTime.now()): Order {
        const newOrder = new Order();
        newOrder._amount = money.amount; // money 파라미터
        newOrder._status = OrderStatus.REQUEST;
        newOrder._orderDateTime = orderTime;
        newOrder._description = description;
        return newOrder;
    }
}
```

**클래스의 멤버변수로 쓸 경우**

```ts
export class Order {
  private _money:Money;

  ...
  static create(money: Money, description: string, orderTime = LocalDateTime.now()): Order {
      const newOrder = new Order();
      newOrder._money = money; // money 필드
      newOrder._status = OrderStatus.REQUEST;
      newOrder._orderDateTime = orderTime;
      newOrder._description = description;
      return newOrder;
  }

  get amount(): {
    return this.money.amount();
  }
}
```

기존의 테스트할 수 없었던 `private` 메소드/함수들을 공개 인터페이스(공개 함수 혹은 클래스)로 추출하여 테스트 하기 쉬운 코드로 개선되었다.

## 마무리 

만약 `private` 메소드/함수가 많다면 그건 또다른 **공개 인터페이스 (클래스, `public` 함수)가 필요**할 가능성이 높다.  
    
즉, 단일 기능에 `private` 메소드/함수가 많다면 클래스/`public` 함수로 분리하는 것을 고려해보자.  
  
정말 이게 해당 객체 혹은 로직 하나에서 모든걸 처리해야하는 것이 맞는지 말이다.

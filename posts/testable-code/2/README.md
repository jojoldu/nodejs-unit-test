# 2. 테스트하기 좋은 코드 - 제어할 수 없는 코드 개선

[1편](https://jojoldu.tistory.com/674) 을 통해 테스트하기 어려운 코드에 대해 이야기를 나눴다.  
이번 편에서는 테스트하기 어려운 코드 중 첫번째인 "제어할 수 없는 코드를 개선하는 법"을 이야기해보자.  

## 2-1. 문제 상황

먼저 앞에서 보았던 `discount()` 코드를 다시 보자.   

```ts
export default class Order {
    ...
    discount() {
        const now = LocalDateTime.now();
        if (now.dayOfWeek() == DayOfWeek.SUNDAY) {
            this._amount = this._amount * 0.9
        }
    }
}
```

여기서 `discount()`는 도메인(`Order`) 의 로직으로 되어있다.  
앞에서 설명한대로 **테스트하기 어려운 코드가 도메인 로직**으로 되어있음을 의미한다.  
  
도메인 로직이 테스트하기 어려운 것은 다른 계층에서 테스트가 어려운것 보다 훨씬 더 문제가 있다.  
해당 로직의 테스트만 어려운게 아니라, **계층 전반의 테스트가 어려워진다**는 것이다.  
  
예를 들어 위 코드를 Spring, Nest.js 등의 MVC 프레임워크에서 사용한다고 가정해보자.  
  
그럼 다음과 같은 코드가 된다.  
  
**Service.ts**

```ts
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        ...
    ) {}
  
    async discount(orderId: number) {
        const order:Order = await this.orderRepository.findById(orderId);
        order.discount();
        await this.orderRepository.save(order);
    }
    ...
}
```

**Controller.ts**

```ts
@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('/discount')
    discount(orderId: number): void {
        return this.orderService.discount(orderId);
    }
}

```

위 3계층의 단위 테스트를 작성한다고 가정해보자.  

* Service 의 `discount` 는 **날짜를 제어할 수 있을까?**
* Controller 의 `discount` 는 **일요일에 할인이 되는지 검증할 수 있을까?**
  
Order 의 테스트와 마찬가지로 **제어할 수 없는** `now()` 로 인해 Repository, Service, Controller 등의 **도메인 계층을 사용하는 모든 계층의 테스트가 어렵다**.  
    
즉, **테스트의 어려움은 전파**가 된다는 것이다.  
  
![layer](./images/layer.png)

테스트하기 어려운 코드가 있다면 **해당 코드에 의존하는 모든 코드들이 다 테스트하기 어렵다**.  
  
그렇기 때문에 **테스트하기 어려운 코드와 테스트하기 쉬운 코드를 분리**해야만 한다.  
둘을 분리해서, 테스트 하기 어려운 코드에 오염되는 영역을 최소화하는 것이 중요하다.  
  
## 2-2. 해결 방법

그렇다면 테스트하기 어려운 코드와 테스트 하기 쉬운 코드는 어떻게 분리할 수 있을까?  
  
가장 쉬운 방법은 **생성자, 함수(메소드)의 인자로 테스트하기 어려운 코드의 결과를 받는 것**이다.  

이번 같은 경우 `Order.discount` 에서 **제어할 수 없는 값을 외부에서 주입**받도록 한다.

```ts
export default class Order {
    ...
    // 현재시간(now)를 밖에서 주입받도록 한다.
    discountWith(now: LocalDateTimw) { 
        if (now.dayOfWeek() == DayOfWeek.SUNDAY) {
            this._amount = this._amount * 0.9
        }
    }
}
```

이렇게 할 경우 다음과 같이 **제어할 수 없는 시간이라는 값**을 내가 원하는 값으로 지정해서 테스트를 작성할 수 있게 된다.

```ts
it('일요일에는 주문 금액이 10% 할인된다', () => {
  const sut = Order.of(10_000, OrderStatus.APPROVAL);
  const now = LocalDateTime.of(2022,8,14,10,15,0); // 2022-08-14 10:15:00 시로 고정
  sut.discountWith(now);

  expect(sut.amount).toBe(9_000);
});
```

물론 이렇게 할 경우 함수의 인자가 너무 많아지는 것은 아닌지 부담스럽게 느낄 수 있다.  
  
그럴때는 크게 2가지가 있는데,

* 같은 Context 라고 생각되는 함수 인자들은 [Dto 패턴](https://martinfowler.com/eaaCatalog/dataTransferObject.html) 으로 묶어서 전달하거나
* (언어에 따라 다르지만) **함수 인자의 기본값**을 사용하는 방법이 있다. 

TS의 경우 다음과 같이 **함수 인자의 기본값으로 제어할 수 없는 값**을 사용하는 방법이 지원된다.

```ts
export default class Order {
    ...
    // 인자가 없을 경우 LocalDateTime.now()를 사용
    discountWith(now = LocalDateTime.now()) { 
        if (now.dayOfWeek() == DayOfWeek.SUNDAY) {
            this._amount = this._amount * 0.9
        }
    }
}
```

이렇게 할 경우 기존의 도메인 코드를 호출하는 쪽은 굳이 함수 인자를 사용할 필요가 없게 된다.


```ts
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        ...
    ) {}
  
    async discountWith(orderId: number) {
        const order:Order = await this.orderRepository.findById(orderId);
        order.discountWith(); // now() 값을 인자로 사용할 필요가 없다.
        await this.orderRepository.save(order);
    }
    ...
}
```

그리고 테스트 코드에서는 함수 인자로 내가 원하는 값을 사용하면 된다.

```ts
it('일요일에는 주문 금액이 10% 할인된다', () => {
  const sut = Order.of(10_000, OrderStatus.APPROVAL);
  const now = LocalDateTime.of(2022,8,14,10,15,0); // 2022-08-14 10:15:00 시로 고정
  sut.discountWith(now);

  expect(sut.amount).toBe(9_000);
});
```

제어할 수 없는 값인 `now()`를 함수 인자로 받도록 변경하는 순간  `Order.discountWith()` 함수는 **항상 일괄된 결과**를 뱉어내고, **테스트 역시 항상 일관된 결과**를 출력하게 된다.  
  
그럼 여기서 **함수 인자의 기본값을 지원하지 않는 언어**에서는 테스트하기 어려운 코드 (`now()`) 을 어디까지 미루면 좋을까?  

## 2-3. 제어할 수 없는 코드의 위치

구조를 해치지 않는 범위 내에선 **가장 바깥쪽으로 밀어내는게** 좋다.  
  
이번 예제의 경우 **Controller**까지 밀어내면 좋다.  
  
**Service.ts**

```ts
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        ...
    ) {}
  
    async discountWith(orderId: number, now = LocalDateTime.now()) {
        const order:Order = await this.orderRepository.findById(orderId);
        order.discountWith(now);
        await this.orderRepository.save(order);
    }
    ...
}
```

**Controller.ts**

```ts
@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('/discount')
    async discount(orderId: number): Promise<void> {
      await this.orderService.discountWith(orderId, now());
    }

    now(): LocalDateTime {
      return LocalDateTime.now();
    }
}
```

> 물론 TS의 경우 기본값 인자가 가능하니 굳이 Controller 에서 할 필요는 없다.  
  

이건 비단, 백엔드 코드에서만 적용되는 것은 아니다.  
내가 작성한 코드의 가장 바깥쪽이란 다음과 같다.

* AWS Lambda 등의 서버리스 환경에서의 `handler` 
* 백엔드 API에서의 Controller
* 웹프론트 혹은 앱 등의 클라이언트에서의 이벤트 핸들러

즉, 프로그램의 진입점이 되는 영역에 최대한 테스트하기 어려운 코드를 모아두고,  
그 이후부터는 테스트 하기 좋은 코드로만 이루어지게 하는게 좋다.


최대한 **제어할 수 없는 코드를 바깥으로 밀어내, 해당 코드에 의존하는 범위를 좁히는 것**이다.  

### 의존성 주입

```ts
export interface NowTime {
  now(): LocalDateTime;
}
```

```ts
export class JodaNowTime implements NowTime {
  now(): LocalDateTime {
    return LocalDateTime.now();
  }
}
```

```ts
export class FakeNowTime implements NowTime{
  private readonly currentTime: LocalDateTime;

  constructor(currentTime: LocalDateTime) {
    this.currentTime = currentTime;
  }

  now(): LocalDateTime {
    return this.currentTime;
  }
}
```

```ts
@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService,
                private readonly nowTime: NowTime) {}

    @Post('/discount')
    async discount(orderId: number): Promise<void> {
        await this.orderService.discountWith(orderId, this.nowTime.now());
    }
}
```

혹은

```ts
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly billingApi?: BillingApi,
        private readonly nowTime: NowTime,
        ) {
    }

    async discountWith(orderId: number, now = LocalDateTime.now()) {
        const order: Order = await this.orderRepository.findById(orderId);
        order.discountWith(this.nowTime.now());
        await this.orderRepository.save(order);
    }
}
```
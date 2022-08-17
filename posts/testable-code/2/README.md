# 2. 테스트하기 좋은 코드 - 테스트하기 좋은 코드로 개선

[1편](https://jojoldu.tistory.com/674) 을 통해 테스트하기 어려운 코드에 대해 이야기를 나눴다.  
이번 편에서는 테스트하기 어려운 코드를 어떻게 테스트 하기 좋은 형태로 개선하는지 이야기해보려고 한다.

## 2-1. 제어할 수 없는 코드 리팩토링

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
해당 로직의 테스트만 어려운게 아니라, **계층 전반의 테스트가 어려워진다**는 더 큰 문제가 있다.  
  
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

위 3계층의 테스트를 작성한다고 가정해보자.  
Order 의 테스트와 마찬가지로 **제어할 수 없는 now로 인해** 테스트 작성이 어렵게 된다.  
**도메인 계층외에도 모든 계층이 테스트 작성이 어렵다**는 것이다.  
  
이는 **테스트의 어려움은 전파** 되기 때문이다.  
  
![layer](./images/layer.png)

즉, 테스트하기 어려운 코드가 있다면 해당 코드에 의존하는 모든 코드들이 다 테스트하기 어려워진다.  
  
그렇다면 여기서 이 제어하기 어려운 코드인 **제어할 수 없는 코드**가 필요한 경우 어떻게 해야할까?  
  
바로 최대한 **제어할 수 없는 코드를 바깥으로 밀어내, 최대한 테스트가 어려운 코드에 의존하는 범위를 좁히는 것**이다.  
  
이번같은 경우 `Order.discount` 에서 **제어할 수 없는 값을 외부에서 주입**받도록 한다.

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

언어에 따라 다르지만, TS의 경우 인자의 기본값을 보장할 수 있는 방법을 지원한다.  
그래서 다음과 같이 구현한다면 기존과 동일하게 `discount()` 로 호출할 수도 있다.

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

이렇게 할 경우 기존의 테스트 코드는 다음처럼 편하게 테스트가 가능하다.

```ts
import { LocalDateTime } from "js-joda";

it('일요일에는 주문 금액이 10% 할인된다', () => {
  const sut = Order.of(10_000, OrderStatus.APPROVAL);
  const now = LocalDateTime.of(2022,8,14,10,15,0); // 2022-08-14 10:15:00 시로 고정
  sut.discountWith(now);

  expect(sut.amount).toBe(9_000);
});
```

이렇게 될 경우 `Order.discount()` 함수는 **항상 일괄된 결과**를 뱉어내고, **테스트 역시 항상 일관된 결과**를 출력하게 된다.   
  
그럼 이 테스트하기 어려운 코드 (`now()`) 을 어디까지 미루면 좋을까?    
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

물론 TS의 경우 기본값 인자가 가능하니 굳이 Controller 에서 할 필요는 없다.

## 2-2. 외부에 의존하는 코드 리팩토링

다음으로 알아볼 코드는 외부의 의존하는 코드를 리팩토링 하는 것이다.

```ts
export default class Order {
    ...
    async cancelOrder(cancelTime): void {
        const cancelOrder = new Order();
        cancelOrder._amount = this._amount * -1;
        cancelOrder._status = OrderStatus.CANCEL;
        cancelOrder._orderDateTime = cancelTime;
        cancelOrder._description = this._description;
        cancelOrder._parentId = this._id;
        
        await getConnection()
          .getRepository(Order)
          .save(cancelOrder);
    }
}
```

이 테스트는 왜 테스트 작성이 너무나 어려운것일까?

* 실행할때마다 변경되는 현재 시간 쿼리 함수 (`NOW()`) 를 쿼리 내부에서 쓰고 있다

* 현재 테스트로 사용중인 데이터베이스에 

### 

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


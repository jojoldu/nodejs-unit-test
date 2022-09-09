# 3. 테스트하기 좋은 코드 - 외부에 의존하는 코드 개선

지난 시간에 테스트하기 좋은 코드에 대해 이야기를 나눴다.

(1) [테스트하기 어려운 코드](https://jojoldu.tistory.com/674)  
(2) [제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)
  
이번 편에서는 테스트하기 어려운 코드를 개선하는 2번째 방법인 **외부에 의존하는 코드를 개선**하는 방법에 대해 이야기를 나눈다.    
  
## 3-1. 문제 상황

[1부](https://jojoldu.tistory.com/674) 에서 소개했던 `cancelOrder()` 코드를 다시 보자. 

```ts
export default class Order {
    ...
    async cancel(cancelTime): void {
        if(this._orderDateTime >= cancelTime) {
            throw new Error('주문 시간이 주문 취소 시간보다 늦을 수 없습니다.');
        }
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

(이전 글에서 언급했지만) 이 로직은 크게 3가지 기능을 담고 있다.

* 주문 취소 시간이 주문 시간 보다 뒤에 있는지 검증하는 로직
* 주문 정보를 기반으로 한 주문 취소 객체 생성
  * 주문취소금액은 원 주문 금액 * -1 이어야 한다
  * 주문 상태는 OrderStatus.CANCEL 이어야 한다
  * 주문 취소 시간은 입력 받은 값을 사용한다
  * 나머지 상태는 원 주문을 따라간다.
* 데이터베이스에 생성된 주문 취소 객체 저장

이 중 데이터베이스 적재를 제외한 나머지 로직들은 검증하기가 굉장히 쉽다.
하지만 데이터베이스 적재 로직으로 인해 검증을 하기가 어려워졌다.

위 코드를 보면 외부와의 연동이 필요한 경우 테스트 코드 작성이 어렵다는 것을 알 수 있다.


이 테스트 코드는 **테스트할때마다 항상 데이터베이스가 필요**하다.  
즉, **주문취소 객체 생성**을 검증하기 위해 항상 깔끔하게 Reset된 데이터베이스가 필요하다는 것이다.  
  
예를 들어 위 코드를 Spring, Nest.js 등의 MVC 프레임워크에서 사용한다고 가정해보자.  
  
그럼 다음과 같은 코드가 된다.  
  
**Service.ts**

```ts
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        ...
    ) {}
  
    async cancel(orderId: number) {
        const order:Order = await this.orderRepository.findById(orderId);
        await order.cancel();
    }
    ...
}
```

Service 계층의 코드만 봐서는 이 코드는 굉장히 깔끔하게 처리된다.  

### Tips

만약 도메인 로직에서 `async/await` (C#, TS와 같은 언어에서) 가 필요하다면 그건 외부와의 연동이 필요한 경우이다.  
그리고 이는 테스트하기가 어렵다.  
  
즉, `async` 함수는 **도메인 로직에 최대한 거리를 두는 것이 좋다**는 것을 의미한다.  
  
물론 **Active Record 패턴**을 생각해보면 Entity에 데이터베이스를 직접 핸들링 하는 코드를 넣을 수도 있다.  
다만, 이는 개인적으로는 선호하지 않는다.  

* [Active Record 패턴 vs Data Mapper 패턴](https://jojoldu.tistory.com/603#dataaccess-%EA%B3%84%EC%B8%B5)

도메인 로직을 테스트 하기 위해 항상 데이터베이스가 필요하는 것이 좋다고 생각되진 않는다.  
이 객체가 저장되는 장소가 데이터베이스가 될지, API로 외부 연동이 될지, NoSQL에 저장될지 아무도 미래를 모르기 때문이다.  
가능하다면 

> Pure Object로 만들어야하지 않냐고 생각할 수 있는데, 현실적으로 ORM을 쓰면서 ORM의 Entity 클래스와 순수 도메인 클래스를 분리해서 사용하는 것이 효율적인 경우가 자주 있지는 않았다.  


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

## 테스트 하기 좋은 코드로 리팩토링

흔히 말하는 Controller-Service-Repository 패턴이라면 Repository 가

실제로는 Controller -> Service -> Domain <- Repository 가 된다.
즉,

### BE

DB에서 값을 가져오는 코드

### FE

Cookie 나 로컬 스토리지를 통해 값을 가져오는 코드




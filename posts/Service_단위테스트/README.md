# Service 계층 Stub 을 이용한 단위 테스트 하기

간혹 Service 계층을 항상 통합 테스트로만 작성하는 경우를 보게됩니다.  
모든 Service를 통합 테스트 혹은 E2E 테스트로만 검증하기 보다는 상황에 따라 적절한 [Stub](https://sungjk.github.io/2022/02/03/mocks-arent-stubs.html)을 사용하여 단위 테스트로 작성한다면 전체 테스트 속도 향상에 도움이 됩니다.  
  
몇가지 예제를 통해 Stub을 사용하는 단위 테스트 코드를 보겠습니다.

## 예제 1.

첫번째 예제로 다음과 같은 서비스 로직에 대한 단위 테스트입니다.

```ts
export class OrderService {
    constructor(private readonly orderRepository: OrderRepository) {
    }

    validateCompletedOrder(orderId: number): void {
        const order = this.orderRepository.findById(orderId);
        if(order.isNotCompleted()) {
            throw new Error('아직 완료처리되지 못했습니다.');
        }
    }
}
```

코드의 흐름을 이야기해보면

* `orderRepository`를 통해 주문을 조회한다
* 조회된 **주문 상태가 완료가 아니면 메세지와 함께 에러**가 발생한다
* 조회된 주문 상태가 완료처리인 경우 그대로 메소드가 종료

여기서 핵심 검증 대상은 "주문 상태가 완료가 아니면 메세지와 함께 에러발생" 이 됩니다.  
이를 단위 테스트로 구현하기 위해서는 주문 조회 로직 (`orderRepository.findById`) 를 stubbing 해야만 합니다.  
  
> 물론 `orderRepository.findById` 의 쿼리가 정상 작동하는지에 대한 테스트는 필수입니다.

### 예제 1. 테스트 코드

코드을 stubbing하는데는 크게 2가지 방법이 있습니다.

* 직접 구현한 Stub 객체 사용
* 특정 stubbing 라이브러리를 사용

2가지 방식을 다 확인해볼텐데요.  
  
먼저 직접 Stub 객체를 구현할 경우 **익명 클래스**를 이용하거나 **일반 클래스**를 구현해서 만들수 있습니다.  

```ts
it('[Stub Class] 주문이 완료되지 못했다면 에러가 발생한다', () => {
    // given
    const stubRepository = new class extends OrderRepository {
        override findById(id: number): Order | undefined {
            return Order.create(1000, LocalDateTime.now(), '');
        }
    }

    const sut = new OrderService(stubRepository);

    // when
    const actual = () => {
        sut.validateCompletedOrder(1)
    };

    // then
    expect(actual).toThrow('아직 완료처리되지 못했습니다.');
});
```

* `OrderRepository` 의 익명 클래스를 Stub 객체로 구현합니다.
  * `findById` 를 원하는 주문 (`Order`) 값이 반환되도록 구현합니다.

위의 `stubRepository` 가 재사용성이 높다면 **별도의 클래스로** 추출해서 사용할 수도 있습니다.

```ts
export class OrderRepositoryStub extends OrderRepository {
    constructor() {
        super();
    }

    override findById(id: number): Order | undefined {
        return Order.create(1000, LocalDateTime.now(), '');
    }
}
```

위 `OrderRepositoryStub` 를 활용한다면 테스트 코드는 다음과 같이 됩니다.

```ts
it('[Stub Class2] 주문이 완료되지 못했다면 에러가 발생한다', () => {
    // given
    const sut = new OrderService(new OrderRepositoryStub());

    // when
    const actual = () => {
        sut.validateCompletedOrder(1)
    };

    // then
    expect(actual).toThrow('아직 완료처리되지 못했습니다.');
});
```

직접 Stub 객체를 구현하는 것이 번거롭게 느껴져 **mock/stub 라이브러리**가 필요하다면 [ts-mockito](https://www.npmjs.com/package/ts-mockito) 를 사용해서 Stub 객체를 구현할 수 있습니다.

```ts
it('[ts-mockito] 주문이 완료되지 못했다면 에러가 발생한다', () => {
    // given
    const order = Order.create(1000, LocalDateTime.now(), '');

    const stubRepository: OrderRepository = mock(OrderRepository);
    when(stubRepository.findById(anyNumber())).thenReturn(order);

    const sut = new OrderService(instance(stubRepository));

    // when
    const actual = () => {
        sut.validateCompletedOrder(1)
    };

    // then
    expect(actual).toThrow('아직 완료처리되지 못했습니다.');
});

```


> 백엔드를 할 경우엔 `jest.mock` 가 좋은 방식이라고 생각하진 않습니다.    
> 차라리 [ts-mockito](https://www.npmjs.com/package/ts-mockito) 를 쓰는 것이 낫다고 생각합니다.  
> `ts-mockito` 활용법은 별도 포스팅으로 정리하겠습니다.

첫번째 예제의 테스트를 작성해보았습니다.  
(`orderRepository` 가 검증되었다는 가정하에) 첫번째 예제의 핵심 기능들이 별도의 DB 없이도 핵심 기능을 검증할 수 있었습니다.  
  
특히 데이터베이스 등의 시스템이 이 필요한게 아니기 때문에 훨씬 더 빠르게 테스트가 수행됩니다.   
또한, 테스트 DB에 원하는 형태의 값을 등록하고, 테스트가 끝난 경우 초기화하는 과정등이 모두 필요없게 되어 테스트 환경 구축에 드는 비용 역시 많이 줄어듭니다.  

## 예제 2.

두번째 예제는 다음과 같이 **우리 시스템 밖의 의존성**을 사용해야할 경우입니다.  
  
* 외부 API를 호출해서 데이터를 전달하고, 보낸 데이터를 검증해야하는 경우
* 이메일 / 슬랙 등으로 메세지를 보내고, 몇개의 메세지가 발송되었는지 검증해야하는 경우

이를테면 다음과 같은 코드입니다.

```ts
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly billingApi: BillingApi
        ) {
    }

    compareBilling(orderId: number): void {
        const order = this.orderRepository.findById(orderId);
        const billingStatus = this.billingApi.getBillingStatus(orderId);

        if(order.equalsBilling(billingStatus)) {
            return ;
        }

        if(order.isCompleted()) {
            this.billingApi.complete(order);
        }

        if(order.isCanceled()) {
            this.billingApi.cancel(order);
        }
    }
```

두번째 예제는 **주문 상태와 결제 상태를 검증하고 이를 맞추는 작업**입니다.

* 주문 ID로 주문 정보를 DB에서 조회합니다.
* 주문 ID로 결제 API에서 해당 주문의 결제 상태를 조회합니다.
* 조회돈 주문과 결제 상태를 검증해서
  * 같을 경우 바로 메소드는 종료합니다.
  * 다를 경우
    * 주문이 완료 상태라면 결제 서비스에 완료 요청을 합니다
    * 주문이 취소 상태이면 결제 서비스에도 취소 요청을 합니다

이 기능을 검증하기 위해서는 **결제 API**에 대한 stubbing이 필요합니다.  
  
하지만, 한가지 문제가 있습니다.  
조회 기능은 첫번째 예제처럼 처리하면 되지만, 다른 기능이 stubbing 처리가 어렵습니다.

* 결제 완료/결제 취소 API로 주문 정보를 전달했음을 어떻게 검증할 것인가? 


만약 API가 아닌 데이터베이스에 저장하는 기능이였다면, 테스트 DB에 저장된 값을 검증하면 됩니다.  
하지만 이번 예제처럼 **상태검증이 어려운 경우** 어떻게 할 것인가 하는 문제가 남는데요.  
  
이를 Mocking 하여 **해당 API를 호출했는지만 검증** 하는것도 하나의 방법입니다.  
하지만 이럴 경우, **잘못된 객체를 넘겨도 테스트는 통과하게 됩니다**.  
  
**의도한대로 객체를 넘겼는지**가 주요 검증 대상이라면 **행위 검증만 해서는 안됩니다**.  
  
이럴 경우 어떻게 테스트할지 알아보겠습니다.  

### 예제 2. 테스트 코드

첫번째 예제에서 사용한 **직접 구현한 Stub 객체** 을 이용하면 쉽게 해결할 수 있습니다.  

```ts
export class BillingApiStub extends BillingApi {
    billingStatus: string;
    completedOrder: Order;
    canceledOrder: Order;

    constructor(billingStatus: string) {
        super();
        this.billingStatus = billingStatus;
    }

    getBillingStatus(orderId: number): string {
        return this.billingStatus;
    }

    complete(order: Order): void {
        this.completedOrder = order;
    }

    cancel(order: Order): void {
        this.canceledOrder = order;
    }
}
```

* 생성자를 통해 **의도한 상태가 반환되도록** 멤버변수로 상태를 저장합니다
* 데이터를 받아 처리하는 `complete`, `cancel` 에서는 **받은 주문 객체를 서로 다른 멤버변수로 저장**합니다.
  * 각각 메소드가 호출되면 멤버변수 `completedOrder`, `cancel` 에 저장합니다.
  * 테스트 코드에서는 저장된 멤버변수의 값을 가져와 **의도한대로 값이 전달되었는지** 검증합니다.

외부 시스템을 통해 객체를 전달해야하는 기능의 경우 이처럼 Stub 클래스에서 내부에 멤버변수를 만들어 테스트에 사용한다면 **외부 시스템으로 넘겨준 객체의 상태를 검증**할 수 있습니다.    

이렇게 Stub 객체를 만들고 테스트 코드를 구현한다면 다음과 같이 됩니다.

> 첫번째 예제에서의 테스트 코드를 모두 사용하는 것을 보여드리려고 직접 Stub 객체를 생성한 것과 Mocking 라이브러리 (ts-mockito) 모두를 사용했습니다.  
> `OrderRepository` 도 일반 클래스나 익명 클래스로 직접 stubbing 해도 됩니다

먼저 **완료 요청**에 대한 테스트 입니다.

```ts
it('주문이 완료인데, 결제가 아닐경우 결제 완료 요청을 한다', () => {
    // given
    const orderStatus = OrderStatus.COMPLETED;
    const order = Order.of(1000, orderStatus);

    const billingStatus = "CANCEL";
    const billingApiStub = new BillingApiStub(billingStatus);

    const stubRepository: OrderRepository = mock(OrderRepository);
    when(stubRepository.findById(anyNumber())).thenReturn(order);

    const sut = new OrderService(instance(stubRepository), billingApiStub);

    // when
    sut.compareBilling(order.id);

    // then
    expect(billingApiStub.completedOrder.id).toBe(order.id);
    expect(billingApiStub.completedOrder.status).toBe(orderStatus);
    expect(billingApiStub.canceledOrder).toBeUndefined();
});
```

* 주문이 완료이면 **결제 API의 complete 으로 원 주문의 정보가 저장** 되었음을 검증할 수 있습니다.
* 이를 검증문에서 Stub 객체 (`BillingApiStub`)를 통해 검증할 수 있습니다.


곧바로 취소 요청에 대한 테스트도 작성합니다.

```ts
it('주문이 취소인데, 결제가 아닐경우 결제 취소 요청을 한다', () => {
    // given
    const orderStatus = OrderStatus.CANCEL;
    const order = Order.of(1000, orderStatus);

    const billingStatus = "COMPLETED";
    const billingApiStub = new BillingApiStub(billingStatus);

    const stubRepository: OrderRepository = mock(OrderRepository);
    when(stubRepository.findById(anyNumber())).thenReturn(order);

    const sut = new OrderService(instance(stubRepository), billingApiStub);

    // when
    sut.compareBilling(order.id);

    // then
    expect(billingApiStub.canceledOrder.id).toBe(order.id);
    expect(billingApiStub.canceledOrder.status).toBe(orderStatus);
    expect(billingApiStub.completedOrder).toBeUndefined();
});
```

마지막으로 **주문과 결제가 동일한 상태**일 경우에 대한 테스트도 작성합니다.

```ts
it('주문과 결제가 동일한 상태일경우 추가결제요청은 하지 않는다', () => {
    // given     
    const orderStatus = OrderStatus.COMPLETED;
    const order = Order.of(1000, orderStatus);

    const billingStatus = "COMPLETED";
    const billingApiStub = new BillingApiStub(billingStatus);

    const stubRepository: OrderRepository = mock(OrderRepository);
    when(stubRepository.findById(anyNumber())).thenReturn(order);

    const sut = new OrderService(instance(stubRepository), billingApiStub);

    // when
    sut.compareBilling(order.id);

    // then
    expect(billingApiStub.completedOrder).toBeUndefined();
    expect(billingApiStub.canceledOrder).toBeUndefined();
});
```

두 객체의 상태가 동일할 경우 아무 API도 호출하지 않았기 때문에 **Stub 객체의 상태가 모두 비어있음**으로 검증할 수 있습니다.


## 주의사항

이렇게 테스트 더블 (Stub/Mock) 혹은 Mock 라이브러리를 통해 처리하는 경우가 항상 옳은 것은 아닙니다.  
그래서 테스트 더블을 사용하는 경우 다음의 주의사항을 꼭 염두해 두어야만 합니다.

### 무분별한 테스트 더블을 활용한 단위 테스트

간혹 Stub, Mock에 빠져 **모든 코드를 Stub, Mock으로 해결**하려는 분들이 있습니다.  
  
특히 대표적인 사례가 다음과 같습니다.
  
* Service에서 하는 것이라곤 Repository의 메소드들을 호출하는게 전부인데, Repository를 전부 Stub/Mock 처리한 경우
  
단위 테스트에만 빠지면 안됩니다.  
  
통합/E2E 테스트와 달리 테스트 더블을 통한 단위 테스트는 **각 Layer, Componenet 간 연동이 되어서도 잘 되는 것을 보장하지는 못한다**

![unit](./images/unit.gif)

stubbing을 통해서 **연동되는 모듈들의 버그 유무는 전혀 고려하지 않은** 상태로 테스트를 하다보니, 실제 연동 과정에서 많은 문제들이 발생할 수 있습니다.  
  
사이드 이펙트가 적은 부분에 한해서 테스트 더블을 사용하는 것이 좋습니다.  
  
가능하다면 **실제 객체**를 사용하는 것이 가장 좋고,  
그게 어려울때만 테스트 더블을 사용하는 것이 좋습니다.  
  
### 점점 깨지기 쉬운 테스트

테스트 더블 객체들은 깨지기 쉬운 테스트 케이스가 되기 쉽습니다.  
이는 Mock/Stub 처리를 위해 그만큼 **테스트가 구현부를 상세하게 의존**하기 때문입니다.  

* [테스트 코드에서 내부 구현 검증 피하기](https://jojoldu.tistory.com/614)

가능하다면 **테스트 더블이 필요 없는 작은 구조**로 구현부의 설계를 개선하는 것이 좋습니다.
그 편이 테스트 더블을 사용 하려고 노력하는 것보다 훨씬 낫습니다.


  

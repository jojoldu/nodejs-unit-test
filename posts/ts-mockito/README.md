# jest.mock 보다 ts-mockito 사용하기

NodeJS 기반의 백엔드에서는 [NestJS](https://docs.nestjs.com/providers#dependency-injection), [RoutingControllers](https://github.com/typestack/routing-controllers) 등 최근 대세가 되는 MVC 프레임워크들이 모두 **Class를 기반으로 한 DI (Dependency Injection)** 방식을 사용하고 있다.  
  
그러다보니 Jest의 Mocking 방식은 백엔드 NodeJS 환경에서 적합한 도구는 아닐 수 있다.  
특히, Mock/Stub 객체 생성에 불편한 점이 많다. 
  
그래서 Test Runner로서 Jest는 사용하더라도, **Mock 라이브러리는 다른 것**을 사용하는 것을 추천하는데, 그 중 대표적인 것들은 다음과 같다.

* [ts-mockito](https://www.npmjs.com/package/ts-mockito)
* [sinonjs](https://sinonjs.org/)
* [jest-mock-extended](https://www.npmjs.com/package/jest-mock-extended)

이번 글에서는 그 중 ts-mockito 를 통한 테스트 더블 (Mock, Stub 등) 활용법을 알아본다.

## 1. Jest 와 ts-mockito 비교

먼저 기존 Jest 방식이 왜 불편한지 보자.  

> Jest로 객체 Mock/Stub 하는것에 대한 불편함만 다룬다.  
> **Jest의 모든 점이 안좋다는 것을 이야기하는 것이 아니다**.
  
테스트할 메인 코드는 다음과 같다.  

```ts
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        ) {
    }

    validateCompletedOrder(orderId: number): void {
        const order = this.orderRepository.findById(orderId);
        if(order.isNotCompleted()) {
            throw new Error('아직 완료처리되지 못했습니다.');
        }
    }
}
```

위 코드의 테스트 코드는 다음과 같은 형태로 구성되어야 한다

*  `OrderRepository` 객체의 `findById` 를 Stub 처리해서 의도한 상태의 주문이 반환되도록 한다.
* 원하는 상태의 주문 정보를 기반으로 에러가 발생 or 정상 종료가 되는지를 검증한다

### Jest

Jest는 기본적으로 **함수 혹은 모듈을 Mocking** 할 수 있다.  
다만 클래스를 기반으로 하는 객체를 Stub, Mock 하는 것이 상대적으로 매끄럽지 못하다.  
  
이를테면 일반적인 DI 기반의 NodeJS 백엔드 프레임워크에서 **특정 객체의 특정 메소드만 의도한 대로 작동**하도록 하기 위해서 Jest는 다음과 같이 `spyOn` 방법을 지원한다.  
  
```ts
it('[jest.mock] 주문이 완료되지 못했다면 에러가 발생한다', () => {
    // given
    const mockRepository = new OrderRepository();
    jest.spyOn(mockRepository, 'findById')
        .mockImplementation((orderId) => orderId === 1?
            Order.create(1000, LocalDateTime.now(), 'jest.mock')
            : undefined);

    const sut = new OrderService(mockRepository);

    // when
    const actual = () => {
        sut.validateCompletedOrder(1)
    };

    // then
    expect(actual).toThrow('아직 완료처리되지 못했습니다.');
});
```

* `const mockRepository = new OrderRepository()`
  * Stub 처리할 객체를 생성한다.
  * 해당 객체의 메소드가 Stub 처리될 예정이다.
* `jest.spyOn(mockRepository, 'findById')`
  * 위에서 만든 mockRepository의 `findById` 메소드를 대상으로 지정한다
* `.mockImplementation()`
  * Stub 함수를 등록할 수 있다
* `(orderId) => orderId === 1?`
  * 별도의 `when` 을 지원하지 않아, Jest에서는 위와 같이 Stub 함수 내부에서 분기 로직을 처리한다.


이 코드에서 개인적으로 느낀 단점은 다음과 같다

* **직관적이지 못한 사용법**
  * 단순한 클래스 Stub에도 장황한 코드가 필요하다.
  * 사용되는 코드들이 기본적인 다른 테스트 프레임워크를 사용해본 사람들에겐 낯설다
  * Spy는 Stub 과는 다르지만, Jest는 Stub 을 지원하지 않아 Spy를 통해 우회한다.
* **문자열 Target Method**
  * 메소드명의 변경이 있을 경우 자동으로 리팩토링이 되지 못한다.
  * IDE의 자동완성 지원을 못받고, 직접 메소드를 입력해야하니 오타 문제 등이 존재한다
* **불편한 인터페이스**
  * 위와 같이 Stub 발생 조건이 `orderId==1` 과 같이 특별한 값이 들어올때로 한정해야할 경우 **Stub 함수에서 처리해야한다**
  * 이렇게 되면 Stub 코드와 발생 조건이 한 함수에서 묶여있어 단일 책임원칙에서 크게 위반된다
  * 이를 해결하기 위해 [jest-when](https://www.npmjs.com/package/jest-when) 라는 다른 패키지가 추가로 필요하다.  
* Test Runner만 교체되어도 쓸 수 없는 테스트 코드
  * 테스트 코드가 이미 Jest의 Mock 코드를 쓰고 있어, 다른 테스트 러너 Karama, Mocha, Cypress 등으로 교체하려고 할경우 테스트 코드 전체를 수정해야만한다
  * Mock 라이브러리가 별도로 있을 경우 테스트 코드 자체의 교체가 필요하진 않다. 

반대로 ts-mockito에서는 어떻게 테스트 코드를 작성하는지 비교해보자.

### ts-mockito

ts-mockito 를 통해 위의 테스트를 다시 구현해보자.

```ts
it('[ts-mockito] 주문이 완료되지 못했다면 에러가 발생한다', () => {
    // given
    const order = Order.create(1000, LocalDateTime.now(), 'ts-mockito');

    const stubRepository: OrderRepository = mock(OrderRepository); // stub 객체 생성
    when(stubRepository.findById(1)).thenReturn(order); // when

    const sut = new OrderService(instance(stubRepository));

    // when
    const actual = () => {
        sut.validateCompletedOrder(1)
    };

    // then
    expect(actual).toThrow('아직 완료처리되지 못했습니다.');
});
```

바로 비교가 될텐데, 굉장히 직관적인 코드의 차이가 있다.

* `mock`
  * Stub, Mock 하고자 하는 대상을 만든다
* `when`
  * **해당 Stub 객체가 어떤 상황일때** 의도한 행동을 하게 할 것인지 지정
  * 지금 같은 경우 `findById` 메소드에 `1` 이 넘어온 경우로 지정
* `.thenReturn`
  * `when` 상황에서 반환할 값을 지정

ts-mockito를 하면서 다음의 장점을 얻게 됩니다.

* ts-mockito에서 jest mock에 비해 훨씬 더 간결한 구문입니다. 
* Java Mockito 라이브러리에 대한 경험이 있다면 집과 같은 편안함을 느낄 것입니다.
* ts-mockito에서 훨씬 더 리팩터링/IDE 친화적인 API
* 프레임워크 독립 - 언젠가 다른 테스트 러너(예: Karma, Cypress)로 마이그레이션하려는 경우 모든 jest.mocks 및 ts-mockito 모의를 교체해야 합니다.
  
## ts-mockito 사용법

### When

### verify

### capture

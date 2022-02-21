# (NodeJS 환경에서) jest.mock 보다 ts-mockito 사용하기 

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
> 이외에는 **Jest는 장점이 많은 테스트 프레임워크이다**.
  
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

* `OrderRepository` 객체의 `findById` 를 Stub 처리해서 의도한 상태의 주문이 반환되도록 한다.
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
        .mockImplementation((orderId) => 
        orderId === 1?
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

* **장황한 사용법**
  * 단순한 클래스 Stub에도 장황한 코드가 필요하다.
  * 사용되는 코드들이 기본적인 다른 테스트 프레임워크를 사용해본 사람들에겐 낯설다
  * Spy는 Stub 과는 다르지만, Jest는 Stub 을 지원하지 않아 Spy를 통해 우회한다.
* **IDE의 지원을 받을 수 없는 문자열 베이스**
  * Stubbing 메소드 지정을 **문자열**로 하기 때문에 IDE의 리팩토링, 자동완성 등을 지원받을 수 없다.
  * 특히 직접 메소드를 입력해야하니 오타 문제 등이 존재한다
* **불편한 인터페이스**
  * 위와 같이 Stub 발생 조건이 `orderId==1` 과 같이 특정 조건이 필요할 경우 **Stub 함수에서 처리해야한다**
  * 이렇게 되면 Stub 코드와 발생 조건이 한 함수에서 묶여있어 단일 책임원칙에서 크게 위반된다
  * 이를 해결하기 위해 [jest-when](https://www.npmjs.com/package/jest-when) 라는 다른 패키지가 추가로 필요하다.  
* **Test Runner에 종속적인 Mocking**
  * 테스트 코드가 이미 Jest의 Mock 코드를 쓰고 있어, 다른 테스트 러너 (Karama, Mocha, Cypress) 등으로 교체하려고 할경우 테스트 코드 전체를 수정해야만한다

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

* `mock`
  * Stub, Mock 하고자 하는 대상을 만든다
* `when`
  * **해당 Stub 객체가 어떤 상황일때** 의도한 행동을 하게 할 것인지 지정
  * 지금 같은 경우 `findById` 메소드에 `1` 이 넘어온 경우 `.thenReturn` 이 발동하도록 지정
* `.thenReturn`
  * `when` 상황에서 반환할 값을 지정

둘을 비교해보면 ts-mockito는 다음과 같은 장점이 있다.

* **직관적인 사용법**
  * 흔히 사용하는 Mocking 방식의 직관적인 메소드들 (`when`, `mock`, `verify` 등)로 테스트 환경이 구축 가능하다
  * 각 Mocking 메소드별 역할이 나눠져있어, **if문으로 Stubbing 트리거 조건을 함께 포함**시키는 등의 행위가 없어진다.
* **IDE의 100% 지원**
  * 문자열이 아닌, 실제 해당 객체의 메소드를 직접 호출하는 방식이라 **리팩토링, 오타방지, 자동완성** 등 IDE의 지원을 100% 받을 수 있다. 
* **Test Runner에 종속적이지 않은 Mocking**
  * Mocking만을 다루기 때문에 Test Runner가 Jest외 다른 것으로 변경되어도 기존 Mocking / Stubbing 코드의 변화가 없다.
* 타 언어와 비슷한 사용법
  * JVM의 Mockito, C#의 Nuget 등과 유사한 인터페이스를 가지고 있어, 다른 언어를 쓰다가 넘어온 개발자도 친숙하게 사용할 수 있다.
  
특히 **직관적인 사용법**과 **IDE의 지원을 100% 받을 수 있다**는 점은 생산성 측면에서 큰 차이이다.  
그럼 이제 ts-mockito의 기본 사용법들을 알아보자.

## 2. ts-mockito 사용법

대부분의 사용법은 [공식 Github](https://github.com/NagRock/ts-mockito) 에 있으니 이를 참고하면 좋다.  
  
여기서는 가장 많이 사용되는 `when`, `verify`, `capture` 에 대해서 알아본다.

### when

when은 **특정 상황에서 어떤 반환값 / 행위를 할지** 지정할 수 있다.  
즉, 아래와 같은 상황을 지정할 수 있다.

* A 라는 값이
* B 라는 메소드로 전달되면
* C 라는 값이 반환되어야 한다

여기서 A라고 불리는 **특정 메소드 인자**의 범위는 다음과 같다

* `1`, `"a"`, `{"name":"jojoldu"} `  등의 고정된 값
* `anyString()`, `anyNumber()` 등 **문자열, 숫자**등의 타입
* `anyOfClass()`, `anyFunction()` 등의 클래스, 함수 타입
* `between()`, `objectContaining` 등 범위 조건

대표적인 사례로 특정 값을 반환하는 `thenReturn` 은 다음과 같이 여러 케이스로 사용할 수 있다.

```ts
class TestClass {}
const testFunction = () => true;

it('when', () => {
    /** given **/
    const mockService: OrderService = mock(OrderService);
    // string
    when(mockService.getOrder(anyString())).thenReturn('anyString');
    when(mockService.getOrder('inflab')).thenReturn('inflab');

    // number
    when(mockService.getOrder(anyNumber())).thenReturn('anyNumber');
    when(mockService.getOrder(1)).thenReturn(1);

    // Class & Function
    when(mockService.getOrder(anyOfClass(TestClass))).thenReturn('TestClass');
    when(mockService.getOrder(anyFunction())).thenReturn('anyFunction');
    when(mockService.getOrder(testFunction)).thenReturn('testFunction');

    // 범위 조건
    when(mockService.getOrder(between(10, 20))).thenReturn('between 10 and 20');
    when(mockService.getOrder(objectContaining({ a: 1 }))).thenReturn('{ a: 1 }');

    /** when **/
    const service: OrderService = instance(mockService);

    /** then **/

    // string
    expect(service.getOrder('test')).toBe('anyString');
    expect(service.getOrder('inflab')).toBe('inflab');

    // number
    expect(service.getOrder(22)).toBe('anyNumber');
    expect(service.getOrder(1)).toBe(1);

    // Class & Function
    expect(service.getOrder(new TestClass())).toBe('TestClass');
    expect(service.getOrder(() => {})).toBe('anyFunction');
    expect(service.getOrder(testFunction)).toBe('testFunction');

    // 범위 조건
    expect(service.getOrder(19)).toBe('between 10 and 20');
    expect(service.getOrder({ b: 2, c: 3, a: 1 })).toBe('{ a: 1 }');
});
```

이 `thenReturn` 외에 지정할 수 있는 것들이 많다

* `thenThrow`: throw Error
* `thenCall`: 별도의 커스텀 메소드(함수)를 호출
* `thenResolve`: resolve promise 
* `thenReject`:  rejects promise

### verify

verify 는 지정된 인자가 **특정 조건** (파라미터 값, 타입, 총 호출된 횟수, 호출 순서 등) 에 맞춰 **몇번, 몇번째 순서로 호출되었음**을 검증할 수 있다.  

```ts
it('verify', () => {
    const mockService: OrderService = mock(OrderService);
    const service: OrderService = instance(mockService);

    service.getOrder(1);
    service.getOrder('test1');
    service.getOrder('test2');
    service.getOrder(10);

    // Call Count verify
    verify(mockService.getOrder(anyNumber())).times(2);
    verify(mockService.getOrder(anyString())).times(2);
    verify(mockService.getOrder(anything())).times(4);
    verify(mockService.getOrder(5)).never(); // 절대 호출 X
    verify(mockService.getOrder(10)).atLeast(1); // 적어도 1번

    // Call order verify
    verify(mockService.getOrder('test2')).calledBefore(mockService.getOrder(10));
    verify(mockService.getOrder(10)).calledAfter(mockService.getOrder('test2'));
});
```

verify 를 쓸때 주의할 점은 다음과 같다

* `verify` 의 인자는 `instance()` 의 결과가 아닌 `mock(OrderService)` 의 결과가 사용되어야 한다

when 절처럼 `instance(mockService)` 를 통해 검증해버리면 오류가 발생한다.  
verify 자체가 검증문이고, 이때는 `mock(OrderService)` 의 결과를 사용해야함을 주의해야한다. 

### capture

마지막으로 `capture` 이다.  
capture는 **Stub 메소드로 넘어온 메소드 인자를 캡쳐**한다.  
이를 통해 **Stub 메소드가 의도한 대로 호출되었음**을 검증할 수 있다.

```ts
it('capture', () => {
    const mockService: OrderService = mock(OrderService);
    const service: OrderService = instance(mockService);

    service.getOrder(1);
    service.getOrder(2);
    service.getOrder('test');
    service.getOrder({ a: 0 });

    expect(capture(mockService.getOrder).first()).toStrictEqual([1]);
    expect(capture(mockService.getOrder).byCallIndex(1)).toStrictEqual([2]);
    expect(capture(mockService.getOrder).beforeLast()).toStrictEqual(['test']);
    expect(capture(mockService.getOrder).last()).toStrictEqual([{ a: 0 }]);
});
```

하나의 메소드에 하나의 인자만 들어올 것이 아니기 때문에 `capture` 의 결과는 **배열**이다.  
그래서 단언문 (assertion) 에서는 항상 배열로 검증해야만 한다.


## 마무리

기존 `jest.mock` 에 비해 ts-mockito는 굉장히 mocking / stubbing을 쉽게 해준다.  
mocking / stubbing 의 코드가 단순해지면서 **테스트 코드는 더욱 직관적**으로 작성할 수 있게 되었다.  
이로 인해서 **내가 작성하지 않은 테스트 코드를 분석**하는데 들어가는 시간을 절약하게 되어 팀 전체의 생산성에 크게 기여하는 라이브러리이다.  

다만 ts-mockito는 더이상 커밋이 되지않는 프로젝트이다.  
그래서 fork 되어 [@johanblumenberg/ts-mockito](https://www.npmjs.com/package/@johanblumenberg/ts-mockito) 에서 이어지고 있다.  
  
기존의 ts-mockito에서 아쉬운 점이 있거나, 버그를 발견하게 된다면 위 fork 프로젝트로 전환을 할 수도 있다.  
혹은 다른 mock 라이브러리가 좀 더 클래스 기반의 프로젝트를 쉽게 처리해준다면 해당 라이브러리로 환승할 수도 있다.  
  
그 전까지는 테스트 코드를 쉽게 작성하도록 도와주기 때문에 추천한다. 


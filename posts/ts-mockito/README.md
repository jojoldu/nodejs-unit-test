# jest.mock 보다 ts-mockito 사용하기

NodeJS 기반의 백엔드에서는 [NestJS](https://docs.nestjs.com/providers#dependency-injection), [RoutingControllers](https://github.com/typestack/routing-controllers) 등 최근 대세가 되는 MVC 프레임워크들이 모두 **Class를 기반으로 한 DI (Dependency Injection)** 방식을 사용하고 있다.  
  
그러다보니 **함수와 모듈 Mocking** 위주의 Jest는 백엔드 NodeJS 환경에서 적합한 도구는 아닐 수 있다.  
특히, Stub 객체 생성에 불편한 점이 많다. 

> Mock과 Stub의 차이가 애매하신 분들은 마틴 파울러의 [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) 글을 꼭 읽어보길 추천한다.  
> [번역본](https://sungjk.github.io/2022/02/03/mocks-arent-stubs.html)도 있다.

이번 글에서는 ts-mockito 를 통한 테스트 더블 (Mock, Stub 등) 활용법을 알아본다.

## Jest 와 ts-mockito 비교

먼저 기존 Jest 방식이 왜 불편한지를 알아본다.  

> Jest로 객체 Mock/Stub 하는것에 대한 불편함만 다룬다.  
> Jest의 모든 점이 안좋다는 것을 이야기하는것이 아니다.
  
jest와 ts-mockito로 테스트할 메인 코드는 다음과 같다.  

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

이를테면 아래와 같이 일반적인 DI 기반의 NodeJS 백엔드 프레임워크에서 **특정 객체의 특정 메소드만 의도한 대로 작동**하도록 하기 위해서 Jest는 다음과 같은 방법을 지원한다.  
  


```ts
it('[jest.mock] 주문이 완료되지 못했다면 에러가 발생한다', () => {
    // given
    let mockRepository = new OrderRepository();
    jest.spyOn(mockRepository, 'findById')
        .mockImplementation(() => Order.create(1000, LocalDateTime.now(), ''));

    const sut = new OrderService(mockRepository);

    // when
    const actual = () => {
        sut.validateCompletedOrder(1)
    };

    // then
    expect(actual).toThrow('아직 완료처리되지 못했습니다.');
});
```

### ts-mockito





### ts-mockito 장점

* ts-mockito에서 jest mock에 비해 훨씬 더 간결한 구문입니다. 
* Java Mockito 라이브러리에 대한 경험이 있다면 집과 같은 편안함을 느낄 것입니다.
* ts-mockito에서 훨씬 더 리팩터링/IDE 친화적인 API
* 프레임워크 독립 - 언젠가 다른 테스트 러너(예: Karma, Cypress)로 마이그레이션하려는 경우 모든 jest.mocks 및 ts-mockito 모의를 교체해야 합니다.
  
## ts-mockito 사용법

### When

### verify

### capture

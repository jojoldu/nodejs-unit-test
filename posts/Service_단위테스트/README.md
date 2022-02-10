# Service 계층 단위 테스트 하기

간혹 Controller와 Service를 항상 통합 테스트 혹은 E2E 테스트로만 작성하는 경우를 본다.  
프레임워크에 따라 다르겠지만, 모든 Controller와 Service를 통합 테스트 혹은 E2E 테스트로만 검증하기 보다는 상황에 따라 적절한 [테스트 더블](https://repo.yona.io/files/4000)을 사용하여 단위 테스트로 작성한다면 전체 테스트 속도 향상에 도움이 된다.  
  
## 예제 1

이를테면 다음과 같은 서비스 로직이 있다고 하자.

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

* repository를 통해 주문을 조회한다
* 조회된 주문 상태가 완료처리가 아닌 경우
  * 메세지와 함께 에러가 발생한다
* 조회된 주문 상태가 완료처리인 경우 그대로 메소드가 종료된다

이런 로직의 경우 `orderRepository` 에서 주문 조회 코드를 모킹한다면 테스트 코드 작성과 테스트 성능을 개선시킬 수 있다.

### 테스트 코드

기존 로직을 모킹한다면, 크게 2가지 방법이 있다.

* 모킹 라이브러리 없이 사용
* 특정 모킹 라이브러리를 사용

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

위의 `stubRepository` 가 재사용성이 높다면 **별도의 클래스로** 추출해서 사용할 수도 있다.

```ts
class OrderRepositoryStub extends OrderRepository {
    constructor() {
        super();
    }

    override findById(id: number): Order | undefined {
        return Order.create(1000, LocalDateTime.now(), '');
    }
}
```


```ts
it('[ts-mockito] 주문이 완료되지 못했다면 에러가 발생한다', () => {
    // given
    const order = Order.create(1000, LocalDateTime.now(), '');

    const stubRepositoryType: OrderRepository = mock(OrderRepository);
    when(stubRepositoryType.findById(anyNumber())).thenReturn(order);

    const sut = new OrderService(instance(stubRepositoryType));

    // when
    const actual = () => {
        sut.validateCompletedOrder(1)
    };

    // then
    expect(actual).toThrow('아직 완료처리되지 못했습니다.');
});

```

> 개인적으로 NodeJS **백엔드 개발을 할 경우에는** `jest.mock` 을 선호하지 않는다.  
> 모듈 자체를 모킹해버려서 **모듈 시스템 후킹**하는 방향으로 애플리케이션 디자인이 되는 경우를 쉽게 보기 때문이다.  
> **애플리케이션 디자인의 의존성 관리를 어지럽히는** 디자인을 유도하는 것 같아서 선호하지 않는다.  


이와 같은 경우 

## 예제 2

## 주의사항

이렇게 테스트 더블 (Stub/Mock) 혹은 Mock 라이브러리를 통해 처리하는 경우가 항상 옳은 것은 아니다.  
그래서 테스트 더블을 사용하는경우 다음의 주의사항을 꼭 염두해 두어야만 한다.

### 점점 깨지기 쉬운 테스트가 될 수 있다

테스트 더블 객체들은 흔히 깨지기 쉬운 테스트 케이스가 되는 경향이 있다.  
이는 **Mock/Stub 처리를 위해 테스트가 그만큼 구현부를 상세하게 의존**하기 때문이다.  

* [테스트 코드에서 내부 구현 검증 피하기](https://jojoldu.tistory.com/614)

가능하다면 **테스트 더블이 필요 없는 작은 구조**로 구현부의 설계를 개선하는 것이 좋다.
그 편이 테스트 더블을 사용 하려고 노력하는 것보다 훨씬 낫다.

### 테스트 더블을 통한 단위 테스트가 실제 기능을 보장하진 못한다

통합/E2E와 별개로 테스트 더블을 통한 단위 테스트는 **각 Layer, Componenet 간 연동이 되어서도 잘 되는 것을 보장하지는 못한다**

![unit](./images/unit.gif)

Mocking을 통해서 **연동되는 모듈들의 버그 유무는 전혀 고려하지 않은** 상태로 테스트를 하다보니, 실제 연동 과정에서 많은 문제들이 발생할 수 있다.  

사이드 이펙트가 적은 부분에 한해서 테스트 더블을 사용하는 것이 좋다.  
      
가능하다면 **실제 객체**를 사용하는 것이 가장 좋고,  
그게 어려울때만 테스트 더블 객체를 사용한다.  
  

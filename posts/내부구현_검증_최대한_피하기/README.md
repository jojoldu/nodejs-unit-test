# 내부 구현 검증을 최대한 피하기

테스트 코드를 작성하고 운영하다보면 **기존 코드가 조금만 변경되어도 테스트를 다 고쳐야하는** 경우가 종종 있다.  
(모든 경우가 그렇진 않겠지만) 기능의 최종 결과를 검증하는게 아니라 **내부 구현을 검증하는 경우**에 자주 이런일이 있었다.  

내부 구현을 검증하는 테스트들은 구현을 조금만 변경해도 테스트가 깨질 가능성이 커진다.  
내부 구현은 언제든지 바뀔 수 있기 때문에 **테스트 코드는 내부 구현 보다 최종 결과를 검증**해야한다.  

그럼, 내부 구현을 검증하는 경우란 어떤 것인지 알아보자.

## 1. 상세 구현부를 다 검증하는 경우

이를 테면 다음과 같이 합계 금액을 구하는 클래스가 있다고 하자.

```javascript
export class OrderAmountSum {
    minusSum: number = 0;
    plusSum: number = 0;

    constructor(amounts: number[]) {
        this.addPlusAmounts(amounts);
        this.addMinusAmounts(amounts);
    }

    get sumAmount(): number {
        return this.plusSum + this.minusSum;
    }

    addPlusAmounts(amounts: number[]): void {
        this.plusSum = amounts
            .filter(amount => amount > 0)
            .reduce((before, current) => before + current);
    }

    addMinusAmounts(amounts: number[]): void {
        this.minusSum = amounts
            .filter(amount => amount < 0)
            .reduce((before, current) => before + current);
    }
}
```

이 클래스의 기능은 `sumAmount()` 이다.  
나머지 `addPlusAmounts` 와 `addMinusAmounts` 은 **부차적인 기능**이다.  
여기서 흔하게 하는 실수가 **부차적인 기능까지 검증하는 것**이다.  
아래 테스트코드가 바로 부차적인 기능까지 검증하는 경우이다.  

```javascript
it('plusSum에는 양수들의 총합이 등록된다', () => {
    const sut = new OrderAmountSum([
        1000, 300, -100, -500
    ]);

    expect(sut.plusSum).toBe(1300);
});

it('minusSum에는 음수들의 총합이 등록된다', () => {
    const sut = new OrderAmountSum([
        1000, 300, -100, -500
    ]);

    expect(sut.minusSum).toBe(-600);
});

it('전체 합계 금액을 구한다', () => {
    const sut = new OrderAmountSum([
        1000, 300, -100, -500
    ]);

    expect(sut.sumAmount).toBe(700);
});

```

얼핏보면 큰 문제가 없어보인다.  
하지만, 이 클래스의 핵심은 `sumAmount`을 통해 합계금액을 구하는 것이다.  
지금 같은 테스트 코드는 이미 **추상화하여 내부로직을 숨겼는데, 다시 내부로직을 드러내게** 하는 것과 다를 바 없다.  

만약 대상 코드를 리팩토링을 통해 다음과 같이 변경 한다고 생각해보자.

```javascript
export class OrderAmountSum2 {
    amounts: number[];

    constructor(amounts: number[]) {
        this.amounts = amounts;
    }

    get sumAmount(): number {
        return this.amounts
            .reduce((before, current) => before + current);
    }
}
```

이렇게 리팩토링하면 **기존의 테스트 코드들은 sumAmount를 제외하고는 전부 깨진다**.  
즉, 내부 구현 방식이 조금만 변경되어도 테스트가 깨질 가능성이 높아진다.  
그래서 이런 경우엔 내부 구현부 하나하나를 검증하기 보다는 비지니스 기능 단위의 검증만 테스트코드로 작성하는 것이 낫다.

```javascript
describe('OrderAmountSum2', () => {
    it('전체 합계 금액을 구한다', () => {
        const sut = new OrderAmountSum2([
            1000, 300, -100, -500
        ]);

        expect(sut.sumAmount).toBe(700);
    });

    it('-금액들의 합계 금액을 구한다', () => {
        const sut = new OrderAmountSum2([
            -1000, -300, -100, -500
        ]);

        expect(sut.sumAmount).toBe(-1900);
    });
});
```

> 이런 테스트들은 [파라미터화 테스트](https://www.daleseo.com/jest-each/)로 더 심플하게 구현할 수도 있다.

## 2. 모의 객체 행위 검증하기

두번째 대표적인 예로 모의 객체를 사용해서 특정 함수(메소드)를 호출하는지를 검증하는 것이다.  
예를 들어 다음과 같이 `Order` 를 새롭게 저장하거나 수정하는 메소드가 있다고 하자.

```javascript
export class OrderService {
  constructor(private

  readonly
  orderRepository: OrderRepository
) {
}

saveOrUpdate(order
:
MyOrder
):
void {
  const savedOrder = this.orderRepository.findById(order.id);
  if(savedOrder) {
    this.orderRepository.update(order);
  } else {
    this.orderRepository.save(order);
  }
}
}
```

이때 모의객체에 심취한 사람이라면 다음과 같은 형태로 단위 테스트를 작성할 수 있다.

```javascript
it('기존 주문이 있으면 새 정보로 갱신된다', () => {
  const savedOrder = MyOrder.create(1000, LocalDateTime.now(), '');
  when(mockedRepository.findById(anyNumber())).thenReturn(savedOrder);
  const sut = new OrderService(instance(mockedRepository));

  sut.saveOrUpdate(createOrder(savedOrder, 200));

  verify(mockedRepository.update(anything())).called();
});
```

대상이 되는 객체가 존재하는 경우 (`savedOrder`) `repository.update` **메소드를 호출**하는지  검증하는 것이다.  

이 테스트의 문제점은 Service의 `saveOrUpdate` 내부에서 **repository를 어떻게 쓰는지 하나하나를 다 검증**했다는 점이다.  

만약 `saveOrUpdate` 의 내부가 다음처럼 변경되면 어떻게 될까?

```javascript
saveOrUpdate(order
:
MyOrder
):
void {
  this.orderRepository.saveOrUpdate(order);
}
```

(요즘의 ORM들은 `save` 메소드에서도 등록/수정을 다 지원한다.)  

그래서 이런 경우엔 **모의 객체의 특정 메소드를 호출했는지를 검증하지말고**, 실제 실행후 최종 상태에 대해 검증해야만 한다.

```javascript
it('[After] 기존 주문이 있으면 새 정보로 갱신된다', () => {
  const savedOrder = realRepository.save(MyOrder.create(1000, LocalDateTime.now(), ''));
  const expectAmount = 200;

  const sut = new OrderService(realRepository);
  sut.saveOrUpdate2(createOrder(savedOrder, expectAmount));

  const result = realRepository.findById(savedOrder.id);

  expect(result.amount).toBe(expectAmount);
});
```

모의 객체 호출 여부를 확인하는 것은 구현을 검증하는 것이지만,  
저장된 객체를 확인하는 것은 최종 결과를 검증하는 것이다.  

## 3. 결론

내부 구현을 검증하는 테스트를 작성할수록 테스트 코드는 리팩토링 내성을 잃게 된다.  
그런 테스트가 많으면 많을수록, 메인 코드를 작성하고 리팩토링 하는 시간 보다 **깨진 테스트를 수정하는데 더 많은 시간을 쏟게 된다**.  
이 점에 유의해서 테스트 코드 작성시 최대한 구현 검증이 아닌 최종 결과 검증을 하는 것을 추천한다.  

> 물론, **기존 레거시 코드에 테스트 코드를 추가할때**는 내부 구현을 검증할 수도 있다.  
> 이렇게 할 경우 각 대상 코드들을 격리화할 수 있어서 로직 파악이나 문제 파악에 좀 더 빠를 순 있지만, 리팩토링 내성이 전혀 없는 코드임은 인지하고 있어야 한다.

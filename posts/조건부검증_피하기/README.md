# 조건부 (if~else) 로직 테스트코드에서 사용하지 않기

테스트 코드는 프로젝트의 생명 주기 보다 길때가 많다.  
**기존의 요구사항을 정리**한것이 테스트 코드이기 때문에, 메인 코드보다 훨씬 더 읽기쉬워야만 한다.  
  
만약 테스트 코드가 복잡한 경우 **어떻게 작동하는지 이해하기가 어렵다**.  
그래서 테스트 코드는 **주석이 필요 없을 정도로 간단해야 한다**.  

그런면에서 조건부 (`if ~ else`) 테스트 로직은 테스트를 실제보다 더 복잡하게 만드는 요인 중 하나다.  
  
이번 글에서는 조건부 로직을 테스트에서 사용한 경우에 어떻게 개선할 수 있을지 알아본다.

## 1. 가변 결과를 검증하는 경우

### 1-1. 문제

첫번째 문제는 다음과 같이 **테스트 실행때마다 결과가 달라지는 경우**이다.  

```ts
it('[Bad] 가변결과 검증', () => {
    const now = LocalDateTime.now();
    const sut = new TimeDisplay();
    const result = sut.display(now);

    let actual;
    if(now.hour() === 0 && now.minute() === 0) {
        actual = 'Midnight';
    } else if (now.hour() === 12 && now.minute() === 0) {
        actual = 'Noon';
    } else {
        actual = now.format(DateTimeFormatter.ofPattern(
            'HH:mm:ss',
        ));
    }

    expect(result).toBe(actual);
});
```

* 00:00 인 경우 `Midnight` 가 반환된다 
* 12:00 인 경우 `Noon` 가 반환된다 
* 그외 나머지인 경우 `HH:mm:ss` 포맷으로 시간이 반환된다 

이 경우 `LocalDateTime.now()` 를 통해 **매번 테스트를 수행할때마다 테스트 환경이 변경**되기 때문에 모든 검증을 한 곳에 담았다.  
  
즉, 테스트 환경을 전혀 제어하지 못했기 때문에 **하나의 테스트 코드가 수많은 케이스를 고려**해야만 한다.  
  
이렇게 작성된 경우, 프로덕션 코드에 문제가 생기게 되면 **매일 서로 다른 이유로 테스트가 실패**하는 경우를 경험하게 되기도 한다.  
  
실제로 실패한 테스트를 수정했다고 생각했다가도, 다음 날엔 또다른 이유로 같은 테스트가 또 실패하게 되기도 한다.  
  
### 1-2. 개선 

이런 경우 다음과 같이 수정할 수 있다.  
  
**테스트 환경을 직접 제어**하는 코드를 작성한다

```ts
it('자정인경우 Midnight가 반환된다', () => {
    const time = LocalDateTime.of(2022, 1, 1)
        .withHour(0) // 0시
        .withMinute(0) // 0분
        .withSecond(0);
    const sut = new TimeDisplay();

    const result = sut.display(time);

    expect(result).toBe('Midnight');
});
```

* `Midnight` 이 발생할 수 있는 `00:00` 으로 테스트 환경을 직접 설정
* 테스트 검증

만약 위 3개 케이스를 모두 하나의 테스트로 검증하고 싶다면 **Parameterized Test**를 작성하면 된다

```ts
it.each([
    [0, 0, 'Midnight'],
    [12, 0, 'Noon'],
    [1, 1, '01:01:00'],
])("hour=%s, minute=%s 이면 actual=%s", (hour, minute, actual) => {
    const time = LocalDateTime.of(2022, 1, 1)
        .withHour(hour)
        .withMinute(minute)
        .withSecond(0);
    const sut = new TimeDisplay();

    const result = sut.display(time);

    expect(result).toBe(actual);
});
```

## 2. 테스트에서 프로덕션 로직 사용

### 2-1. 문제

두번째 문제는 테스트에서 프로덕션 로직을 사용한 경우이다.  
하나의 테스트 코드에서 여러 입력값을 검증하려다보면 이런경우가 종종 발생한다.  
  
하나의 메소드에서 여러 입력값과 그에 따른 여러 결과를 검증 하기 위해서는 어쩔수 없이 **기대값을 계산 하기 위해 테스트 내부에 로직을 넣게 된다**

```ts
it('테스트에서 프로덕션 로직 사용', () => {
    const sut = new Calculator();
    let result;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const actual = sut.calculate( i, j );

            if (i==3 && j==4)  // 특이케이스
                result = 8;
            else
                result = i+j;

            expect(result).toBe(actual);
        }
    }
});
```

이렇게 작성된 테스트는 **프로덕션 로직이 변경이 있을때마다 테스트 코드도 함께 변경**해야만 한다.  
행여나 로직은 다르고, 결과는 같더라도 **틀린 프로덕션 로직을 테스트 코드에서 쓸 순 없으니** 무조건 코드 수정이 필요하게 된다.  
  
### 2-2. 개선

가능하면 SUT (`System Under Test`) 를 테스트하기 위해 미리 계산된 값을 사용하는 것이 좋다.  

> 이에 대해선 [예전 포스팅](https://jojoldu.tistory.com/615)을 참고하면 좋다.

아래와 같이 작성할 경우 로직이 분산되지 않고, **프로덕션 코드이 변경된다고 해서 테스트 코드도 무조건 변경이 필요하지 않는 상황**을 만들 수 있다.

```ts
it('[Good] Calculator 에 3, 4가 입력되면 8이 반환된다', () => {
    const sut = new Calculator();

    const result = sut.calculate(3, 4);

    expect(result).toBe(8);
});
```

다양한 케이스를 검증하고 싶다면, 1과 마찬가지로 **Parameterized Test** 를 사용해서 검증할 수 있다.

```ts
    it.each([
        [3, 4, 8],
        [1, 1, 2],
    ])("num1=%s, num2=%s 이면 actual=%s", (num1, num2, actual) => {
        const sut = new Calculator();

        const result = sut.calculate(num1, num2);

        expect(result).toBe(actual);
    });
```

## 3. 중복 코드 추출로 인한 다중 검증


### 3-1. 문제

마지막 3번째 문제는 **중복 코드를 리팩토링**하는 과정에서 발생하는 경우이다.  
아래의 경우 검증할때 사용할 메소드가 달라 **Parameterized Test**를 사용하기는 어렵다.  
  
```ts
it('[Bad] 추출된 중복 테스트 코드#1', () => {
    const order = new Order();
    order.status = COMPLETED;

    expect(order.isCompleted()).toBe(true); 
});

it('[Bad] 추출된 중복 테스트 코드#2', () => {
    const order = new Order();
    order.status = CANCEL;

    expect(order.isCanceled()).toBe(true);
});
```

반면에, **검증 부분만 조건문으로 처리하면 대부분의 코드가 중복코드**가 된다.  
그래서 리팩토링을 하여 다음과 같이 개선하게 된다.

```ts
it('[Bad] 추출된 중복 테스트 코드#1', () => {
    testOrder(OrderStatus.COMPLETED);
});

it('[Bad] 추출된 중복 테스트 코드#2', () => {
    testOrder(OrderStatus.CANCEL);
});

function testOrder(status: OrderStatus): void {
    const order = new Order();
    order.status = status;

    if (status === OrderStatus.COMPLETED) {
        expect(order.isCompleted()).toBe(true); // boolean 타입까지 일치하는 것을 확인하기 위해
    } else if (status === OrderStatus.CANCEL) {
        expect(order.isCanceled()).toBe(true);
    }
}
```

이렇게 코드가 작성 될 경우 조건문 특유의 복잡함은 그대로 가진채로 **테스트 본연의 의미도 퇴색하게 된다.  
  
**테스트 코드가 어떤 상황에서, 무엇을 검증하는 것인지 전혀 알 수가 없다**.  
이렇게 되면 테스트 코드가 문서로서의 역할을 전혀 하지 못하게 된다.  

### 3-2. 개선

위와 같이 중복된 코드가 보였을때 리팩토링을 하더라도, 2가지의 전제조건을 가져가면 좋다.

* 해당 테스트가 무엇을 하는지 **테스트 코드만으로 확인이 가능해야한다**
* 조건문을 최대한 피한다.

그럼 다음과 같이 리팩토링이 가능하다

```ts
it('[Good] 추출된 중복 테스트 코드#1', () => {
    const sut = createOrder(OrderStatus.COMPLETED);

    expect(sut.isCompleted()).toBe(true);
});

it('[Good] 추출된 중복 테스트 코드#2', () => {
    const sut = createOrder(OrderStatus.CANCEL);

    expect(sut.isCanceled()).toBe(true);
});

function createOrder(status: OrderStatus): Order {
    const order = new Order();
    order.status = status;
    return order;
}
```

## 4. 마무리

조건부 (`if ~ else`) 테스트 로직의 문제는 실제로 **테스트가 수행할 작업을 정확히 알기 어렵게 만든다는 것** 이다.  
조건부가 없는 단일 로직밖에 없는 테스트 코드는 항상 똑같은 방식으로 실행된다.  
반면 여러 실행 경로가 있는 코드는 확신하기가 훨씬 어렵다.  
  
조건부 로직으로 인해 **테스트 코드가 실행할 때마다 다르게 작동된다면 어떻게 테스트 코드를 신뢰할 수 있을까**?    
  
조건문 또는 반복문이 있거나 실행할 때마다 다른 값을 사용하는 테스트는 확정된 결과와 로직을 사용하는 것이 아니기 때문에 디버깅하기가 매우 어렵다.  
  
그래서 테스트 코드 내에서는 조건문은 안쓰는 것이 가장 좋다.

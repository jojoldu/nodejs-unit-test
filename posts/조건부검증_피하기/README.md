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

### 2-2. 개선


가능하면 SUT 를 테스트하기 위해 미리 계산된 값 세트를 열거하는 것이 좋습니다.  
다음은 (더 작은) 열거형 값 집합을 대신 사용하여 동일한 논리를 테스트하는 예입니다.

```ts

    it('[Good] Calculator 에 3, 4가 입력되면 8이 반환된다', () => {
        const sut = new Calculator();

        const result = sut.calculate(3, 4);

        expect(result).toBe(8);
    });

```

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

### 3-2. 개선


## 4. 마무리

  
조건부 (`if ~ else`) 테스트 로직의 문제는 실제로 **테스트가 수행할 작업을 정확히 알기 어렵게 만든다는 것** 입니다.  
  
조건부가 없는 단일 로직밖에 없는 테스트 코드는 항상 똑같은 방식으로 실행됩니다.  
반면 여러 실행 경로가 있는 코드는 확신하기가 훨씬 어렵습니다.  

프로덕션 코드에 대한 자신감을 높이기 위해 해당 코드를 실행하는 자체 검사 테스트 (테스트 자동화의 목표 참조) 를 작성합니다.  

테스트 코드가 실행할 때마다 다르게 실행된다면 어떻게 테스트 코드에 대한 확신을 높일 수 있습니까?  

테스트가 우리가 검증하고자 하는 행동을 검증하고 있는지 알기(또는 증명하기) 어렵습니다.  

분기 또는 루프가 있거나 실행할 때마다 다른 값을 사용하는 테스트는 완전히 결정적이지 않기 때문에 디버그하기가 매우 어려울 수 있습니다.

관련된 문제는 Conditional Test Logic 이 테스트를 올바르게 작성하기 어렵게 만든다는 것입니다. 테스트는 쉽게 테스트할 수 없기 때문에 잡아야 하는 버그를 실제로 감지할 수 있는지 어떻게 알 수 있습니까? (이것은 Obscure Tests (X 페이지) 의 일반적인 문제입니다 . 단순 코드보다 Buggy Tests (X 페이지) 가 발생할 가능성이 더 큽니다 .)
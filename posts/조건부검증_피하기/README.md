# 조건부 (if~else) 검증 사용하지 않기

완전 자동화 된 테스트 (X 페이지의 테스트 자동화 목표 참조) 는 다른 코드의 동작을 확인하는 코드일 뿐입니다. 이 코드가 복잡한 경우 제대로 작동하는지 어떻게 확인 합니까 ? 테스트를 위한 테스트를 작성할 수는 있지만 이 재귀는 언제 멈출까요? 간단한 대답은 테스트 방법 (X 페이지) 이 테스트가 필요 없을 정도로 간단해야 한다는 것입니다.

조건부 테스트 논리 는 테스트를 실제보다 더 복잡하게 만드는 요인 중 하나입니다.  
  
Conditional Test Logic 의 문제 는 실제로 중요할 때 테스트가 수행할 작업을 정확히 알기 어렵게 만든다는 것 입니다. 실행 경로가 하나만 있는 코드는 항상 똑같은 방식으로 실행됩니다. 여러 실행 경로가 있는 코드는 확신하기 훨씬 어렵습니다.

프로덕션 코드에 대한 자신감을 높이기 위해 해당 코드를 실행하는 자체 검사 테스트 (테스트 자동화의 목표 참조) 를 작성합니다. 테스트 코드가 실행할 때마다 다르게 실행된다면 어떻게 테스트 코드에 대한 확신을 높일 수 있습니까? 테스트가 우리가 검증하고자 하는 행동을 검증하고 있는지 알기(또는 증명하기) 어렵습니다. 분기 또는 루프가 있거나 실행할 때마다 다른 값을 사용하는 테스트는 완전히 결정적이지 않기 때문에 디버그하기가 매우 어려울 수 있습니다.

관련된 문제는 Conditional Test Logic 이 테스트를 올바르게 작성하기 어렵게 만든다는 것입니다. 테스트는 쉽게 테스트할 수 없기 때문에 잡아야 하는 버그를 실제로 감지할 수 있는지 어떻게 알 수 있습니까? (이것은 Obscure Tests (X 페이지) 의 일반적인 문제입니다 . 단순 코드보다 Buggy Tests (X 페이지) 가 발생할 가능성이 더 큽니다 .)

```ts
it('가변결과 검증하는 경우', () => {
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

```ts
it('프로덕션 로직을 테스트에서 사용하는 경우', () => {
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

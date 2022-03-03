# 조건부 (if/switch) 검증 사용하지 않기

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

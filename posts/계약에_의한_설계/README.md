# 계약에 의한 설계

니가 코드를 작성할 때 여기는 무조건 요거 요거가 와야해 라고 설명을 해야하는 부분이 있다면 그건 바로 어설션이 들어가야 하는 부분이다.
값을 제한하는 것은 중요하다.
대표적으로 일부의 문자열만 들어가야할 부분은 Enum 을 활용해야 한다.
숫자의 범위, null 등에 대해서는 보통 일급컬렉션 등을 활용한다.
단, 사용자가 입력한 경우, DB에서 뽑은 데이터 등에 대해서는 예외처리를 해야하며,
우리가 직접 코드를 작성할때의 경우에 해당한다.

Assertion은 일반적으로 개발 단계에서는 코드에 포함되어서 실행되어야 하지만, Production 에서는 제외되어야 한다.
일종의 로그 레벨과 비슷하다.
log.error 는 실제 운영 환경에서 출력이 되어야하지만
log.debug 는 개발 혹은 QA 환경에서만 출력이 되어야 한다.

이처럼 위 Assertion 은 **개발 단계에서 검사를 해주는 주석**과 같다.
실행 가능한 주석이다


사용처
- 발생이 예상되는 상황에 대해서는 예외처리
* 절대로 발생해서는 안되는 조건에 대해서만 사용한다

실행할 가능성이 있는 코드를 어션설에 입력하지 않는다.
절대로 코드에서 발생해서는 안되는 오류를 처리하는데 사용해야 한다.

TypeScript 3.7 에는 assert  함수가 추가 되었다

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions


```ts
// as-is
Assert (action()); // 실행 안됨

// to-be
const actionResult = action();
Assert (actionResult); 
```


# null 을 처리하는 방법

> 여기서는 `null` 과 `undefined` 를 구분하지 않고 null 로 통일해서 표현한다. 

## null을 안전하게 다루는 패턴

### null을 반환하지 않기

null 를 반환하고 싶다면 그대신 예외를 던지거나 특수 사례 객체를 반환한다.

### null 을 전달하지 않기

함수나 객체의 인자로 null 을 전달하는 것은 피한다.

## 언어의 도움 받기

### Optional chaining (?.)

TypeScript 3.7 이상의 버전에서는 optional chaining을 사용하여 객체나 함수의 속성이 null 또는 undefined인 경우 안전하게 접근할 수 있습니다. 예를 들어, user?.name 코드는 user가 null이나 undefined가 아닌 경우에만 name에 접근합니다.

```ts
let user = {
  name: 'Alice',
  address: null
};

console.log(user?.address?.street); // 출력: undefined
```

### Nullish coalescing (??)

Nullish coalescing 연산자를 사용하면 null 또는 undefined 값을 쉽게 처리할 수 있습니다. 예를 들어, let value = input ?? "default" 코드는 input이 null 또는 undefined인 경우 value에 "default"를 할당합니다.

```ts
let input = null;
let value = input ?? "default";

console.log(value); // 출력: "default"
```

### Type guards

TypeScript에서는 type guards를 사용하여 null이나 undefined를 안전하게 확인할 수 있습니다. 예를 들어, if (value) 또는 if (typeof value !== "undefined")와 같은 조건문을 사용하여 value가 undefined인지 확인할 수 있습니다.

### Non-null assertion operator (!) 

TypeScript에서는 느낌표(!)를 사용하여 값이 null이나 undefined가 아님을 명시적으로 표시할 수 있습니다. 그러나 이는 값이 실제로 null이나 undefined일 수 없음을 확신하는 경우에만 사용해야 합니다.

```ts
let user!: User; // User가 null 또는 undefined가 아님을 보장합니다.

user.doSomething(); // 에러가 발생하지 않습니다.
```

### strictNullChecks option 

TypeScript의 tsconfig.json 파일에서 strictNullChecks 옵션을 true로 설정하면, 모든 값이 기본적으로 null 또는 undefined가 될 수 없다고 가정합니다. 이를 통해 런타임 오류를 방지할 수 있습니다.




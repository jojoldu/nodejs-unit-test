# null 을 다루는 방법

> 여기서는 `null` 과 `undefined` 를 구분하지 않고 null 로 통일해서 표현한다. 

TypeScript나 Kotlin 등 요즘의 모던한 문법을 지원하는 언어들을 사용하다보면 `null` 값들을 안전하게 다루는 여러가지 방법들을 알게 된다.  
다만, 이런 것들은 대부분 지엽적인 경우가 많다.  
**이미 Null값이 프로젝트 전방위적으로 퍼져있는 경우**에 어떻게 `null` 값을 다룰 것인가 같은 경우이다.  
예를 들어 대표적인 `null` 을 다루는 방법으로 소개하는 것이 바로 Optional chaining (`?.`) 이다.  

```ts
let user = {
  name: 'Alice',
  address: null
};

console.log(user?.address?.street); // 출력: undefined
```

이 문법적 기능을 이용하면 `null` 로 인한 `Null Exception` 을 피할 수 있다.
하지만 이런 방법은 `null` 을 다루는 방법이 아니라 `null` 을 피하는 방법이다.  
  
이런 문법 지원이 있으면 좋지만, 저것만이 `null` 을 다루는 방법이 될 순 없다.  
예를 들어 모든 객체의 하위 탐색이 있을때마다 `?.` 을 붙이는 것을 팀 컨벤션으로 할 것인가? 등의 고민이 생긴다.

이번 시간에 이야기해볼 것은 `null` 을 다루는 방법이다.  
저런 문법적 도움 없는 언어나 생태계에서도 통용되며,  
근본적으로 저런 `null` 관련 기능들의 사용을 최소화할 수 있는 패턴 혹은 구조를 이야기 해보고 싶다.


## Null (Undefined) 회피 방법

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


## null을 안전하게 다루는 패턴

### 입구에서 막기

![entry1](./images/entry1.png)

(출처: [tobaek.com](https://tobaek.com/58))

![entry2](./images/entry2.png)

(출처: [kkmg2012.tistory.com](https://kkmg2012.tistory.com/1329))

#### Pre Condition

#### Decorator

- Request DTO

### Null을 반환하지 않는다

```ts
function getClassNames(element: HTMLElement): string[] {
  const attribute = element.getAttribute('class');
  if(attribute !== null) {
    return null;
  }
  
  return attribute.split(' ');
}

function isElementHighlighted(element: HTMLElement): boolean {
  const classNames = getClassNames(element);
  if(classNames === null) {
    return false;
  }
  
  return classNames.includes('highlighted');
}
```

```ts
function getClassNames(element: HTMLElement): string[] {
  const attribute = element.getAttribute('class');
  if(attribute !== null) {
    return [];
  }
  
  return attribute.split(' ');
}

function isElementHighlighted(element: HTMLElement): boolean {
  return getClassNames(element).includes('highlighted');
}
```



boolean이 반환될때 역시 `false`를 반환하는 것이 좋다.  
Null과 false가 구분이 필요하다면 이건 **3개의 경우를 표현해야하는 열거형**이 필요한 경우이지, 2가지 경우를 표현하는 boolean 타입이 필요한 경우가 아니다.

```ts
// bad
null, false, true

// good
READY, PASS, FAIL
```

문자열은 상황에 따라 다르다.

```ts
export class UserComment {
  private _comment: string | null = null;
  
  get comment(): string {
    return this._comment ?? '';
  }
}
```

단, 문자열이 단순히 문자열 데이터로서 의미하는게 아니라, 특정 의미를 지니는 경우엔 Null을 반환하는 것이 낫다.

```ts
export class Payment {
  private _cardNo: string | null = null;
  
  get cardNo(): string | null {
    return this._cardNo;
  }
}
```

**카드 거래가 없음을 나타내기 때문**

### Null을 함수 인자로 전달하지 않는다.

null로 지나치게 유연한 메서드를 만들지 말고 **명시적인 메서드/함수를 만들어야 한다**.  

- 함수나 객체의 인자로 null 을 전달하는 것은 피한다.

#### 외부에서 전달 받는 값일 경우

사용자의 입력, DB의 조회, API 조회 결과 등 외부의 입력으로 `null` 일 수 있다.  
이럴 경우 `null` 을 전달 받은 가장 가까운 곳에서 `null` 을 처리하고, 그 이후로는 `null` 을 전달 받지 않는다.





### null 의 범위를 메소드/함수 지역으로 제한한다.

- null을 반환하지 말라
    -  반환 값이 꼭 있어야 한다면 null을 반환하지 말고 예외를 던져라.
    - 빈 반환 값은 빈 컬랙션이나 `Null 객체` (`특수 사례 객체`) 를 활용하라
    -  반환 값이 없을 수도 있다면 null을 반환하지 말고 `Optional` 을 반환하라

### 명확한 초기값을 설정한다.

- 초기화 시점과 실행 시점이 겹치지 않아야 한다
- 실행 시점엔 초기화되지 않은 필드가 없어야 한다
- 실행 시점에 null인 필드는 초기화되지 않았다는 의미가 아닌, 값이 없다는 의미여야 한다.
- 객체 필드의 생명주기는 모두 객체의 생명주기와 같아야 한다.
- 지연 초기화(lazy initialization) 필드의 경우 팩토리 메서드로 null 처리를 캡슐화 하라


### Null Object Pattern

값을 얻을 수 없을 때 Null (Undefined) 혹은 `Optional` 을 반환하는 대신 Null Object를 반환할 수 있다.  

- Null 대신 유효한 값이 반환 되어 이후 실행 되는 로직에서 Null로 인한 피해가 가지 않도록 한다.
- 가장 대표적인 사례로 빈 문자열, 빈 배열이 있다.


#### 주의할 점

널 객체 패턴은 신속한 실패를 못하게 한다.  
오류가 있는 상황이라 더이상 Flow를 진행하면 안되는 경우라면 바로 Exception을 발생시키는 것이 옳으며, 괜히 널 객체로 인해 실제 오류가 발생한 지점에서 멀리 떨어진 함수에서 오류가 발생해선 안된다.

```ts
interface User {
  render(): JSX.Element;
}

class AuthenticatedUser implements User {
  constructor(private username: string) {}

  render(): JSX.Element {
    return <h2>Welcome back, {this.username}!</h2>;
  }
}

class GuestUser implements User {
  render(): JSX.Element {
    return <h2>Welcome, Guest!</h2>;
  }
}
```

```ts
interface AppProps {
  user: User;
}

function App({ user }: AppProps) {
  return (
    <div>
      {user.render()}
      {/* Other components */}
    </div>
  );
}
```

```ts
let authenticatedUser = new AuthenticatedUser('JohnDoe');
let guestUser = new GuestUser();

ReactDOM.render(<App user={authenticatedUser} />, document.getElementById('root'));  // Output: Welcome back, JohnDoe!
ReactDOM.render(<App user={guestUser} />, document.getElementById('root'));  // Output: Welcome, Guest!
```





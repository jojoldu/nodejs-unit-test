# 3. 좋은 함수 만들기 - Null 을 다루는 방법


> 여기서는 `null` 과 `undefined` 를 구분하지 않고 null 로 통일해서 표현한다. 

정적 분석 서비스 [rollbar](https://rollbar.com/) 에서 **1000개 이상의 JS 프로젝트**에서의 소프트웨어 결함 통계를 공개했다.  

![intro1](./images/intro1.png)

(출처: [top-10-javascript-errors-from-1000-projects](https://rollbar.com/blog/top-10-javascript-errors-from-1000-projects-and-how-to-avoid-them/))


**상위 1~10위까지의 대부분이 null과 undefined 로 인한 문제**였다.  
이 외에 (과거 자료지만) 안드로이드 플레이 스토어의 Top 1,000 Popular Apps 들을 분석한 결과에서도 `NullPointerException` 가 전체 결함 중 2번째였다.  

![intro2](./images/intro2.png)

(출처: [Multi-objective Automated Testingfor Android Applications](http://www0.cs.ucl.ac.uk/staff/K.Mao/archive/p_issta16_sapienz.pdf))

이 만큼 빈값(`Null`, `Undefined`) 을 다루는 것이 애플리케이션을 구현/개선하는데 중요한 역할을 한다.
  
## 1. 요즘의 Null 문법

TypeScriptt나 Kotlin 등 요즘의 모던한 문법을 지원하는 언어들을 사용하다보면 `null` 값들을 안전하게 다루는 여러가지 방법들을 알게 된다.  
다만, 이런 것들은 대부분 지엽적인 경우가 많다.  
이미 Null값이 프로젝트 전방위적으로 퍼져있는 상태에서 **어떻게 Null 에러를 피할 것인가**같은 경우이다.  
예를 들어 대표적인 `null` 을 다루는 방법으로 소개하는 것이 바로 **Optional chaining** (`?.`) 이다.  

```ts
let user = {
  name: 'Alice',
  address: null
};

console.log(user?.address?.street); // 출력: undefined
```

이외에도 **Nullish coalescing** (`??`) 을 활용할 수도 있다.

```ts
let input = null;
let value = input ?? "default";

console.log(value); // 출력: "default"
```

이런 문법적 기능을 이용하면 인한 `Null Exception` 을 피할 수 있다.
하지만 이런 방법은 Null 을 다루는 방법이 아니라 **Null 을 피하는 방법**이다.  
  
이런 문법 지원이 있으면 좋지만, 저것만이 `null` 을 다루는 방법이 될 순 없다.  
**모든 객체의 하위 탐색이 있을때마다 `?.` 을 붙일 것**인가? 등의 고민이 생긴다.

이번 시간에 이야기해볼 것은 `null` 을 다루는 방법이다.  
저런 문법적 도움 없는 언어나 생태계에서도 통용되며,  
근본적으로 저런 **Null 관련 기능들의 사용을 최소화할 수 있는 패턴** 혹은 구조를 이야기 해보고 싶다.

## 2. null을 안전하게 다루는 패턴

### 2-1. 입구에서 막기

![entry1](./images/entry1.png)

(출처: [tobaek.com](https://tobaek.com/58))

![entry2](./images/entry2.png)

(출처: [kkmg2012.tistory.com](https://kkmg2012.tistory.com/1329))

```ts
function myFun(user : User) {
  if(user.name.length > 10) {
    throw new Error('Name must be longer than 10 chars');
  }
  
  if(user.age < 19) {
    throw new Error('age must be lower than 19 years old');
  }
  ....
  businessLogic
}
```

```ts
function myFun(user : User) {
  requires(user.name.length > 10, 'Name must be longer than 10 chars');
  requires(user.age < 19, 'age must be lower than 19 years old');
  ....
  businessLogic
}
```

```ts
export class User {
  @Length(10, 20)
  name: string;

  @IsInt()
  @Min(20)
  age: number;
}
```

- typestack/class-validator

#### 사전 조건 (Precondition, Guard Clause)


Java와 같은 언어에서는 계약에 의한 설계(`Design by Contract`) 를 할 수 있다.

```java
assert 식1;
assert 식1 : 식2;

ex)

private void setRefreshInterval(int interval) {
  assert interval > 0 && interval <= 1000/MAX_REFRESH_RATE : 'interval must be positive and less than 1000/MAX_REFRESH_RATE';
  ...
}
```

- Boolean 식1이 거짓이면 `AssertionError` 발생
  - `Exception` 아님! (주의)
- **private 메소드에서만 사용**
  - 나 스스로가 소비자 이면서 제공자일때 사용하는 구문
  - 내가 만든 API의 사용자가 누구인지 모를때는 사용하면 안된다.
- `-enableassertions` 또는 `-ea` 옵션으로 활성화 가능
  - 런타임에서는 실행되지 않는다.
  - 운영 환경에서는 이 구문이 무시 된다.

사전체크 대신에 단정문이 필요한 경우는 **개발단계에서 실행가능한 주석으로서의 효과**를 기대할 수 있다.


#### Decorator

- Request DTO

### Null을 반환하지 않는다

null 의 범위를 메소드/함수 지역으로 제한한다.

상태와 비슷하게 Null도 지역적으로 제한할 경우 큰 문제가 안된다.  
메서드/함수의 인자로 전달되는 경우, 메서드/함수 내부에서만 null을 사용하고, 외부로 전달되지 않도록 한다.


값을 얻을 수 없을 때 Null (Undefined) 혹은 `Optional` 을 반환하는 대신 Null Object를 반환할 수 있다.

Null 대신에 Exception을 던진다
Null 대신에 Null Object를 반환한다.

- Null 대신 유효한 값이 반환 되어 이후 실행 되는 로직에서 Null로 인한 피해가 가지 않도록 한다.
- 반환 값이 꼭 있어야 한다면 null을 반환하지 말고 예외를 던져라.
  - 빈 반환 값은 빈 컬랙션이나 `Null 객체` 를 활용하라

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
  if(classNames === null) { // 호출측에서 다시한번 null 체크 필요
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

#### Null Object Pattern by React

**기본값이 있는 경우**

```jsx
// bad
const UserInfo = ({ user }) => {
  return (
          <div>
            <p>Name: {user?.name ?? 'Not Available'}</p>
            <p>Email: {user?.email ?? 'Not Available'}</p>
          </div>
  );
};

const ParentComponent = ({ user }) => {
  return <UserInfo user={user} />;
};
```

- user 객체가 nonnull인지 체크 (`user?`)
- user 객체의 필드가 nonnull인지 체크 (`user?.name`, `user?.email`)

```jsx
// good
const UserInfo = ({ user }) => {
  return (
          <div>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
          </div>
        );
};

const ParentComponent = ({ user }) => {
  // user가 null인 경우 대신 사용할 null 객체
  const nullUser = {
    name: 'Not Available',
    email: 'Not Available',
  };

  return <UserInfo user={user || nullUser} />;
};
```

- 추가적인 NotNull 체크를 계속해서 할 필요가 없다.


```ts
class User {
  name = 'Not Available',
  email = 'Not Available',

  constructor(name: string, email: string) {
      this.name = name;
      this.email = email;
  }
}
```

#### 주의할 점

널 객체 패턴은 신속한 실패를 못하게 한다.  
오류가 있는 상황이라 더이상 Flow를 진행하면 안되는 경우라면 바로 Exception을 발생시키는 것이 옳으며, 괜히 널 객체로 인해 실제 오류가 발생한 지점에서 멀리 떨어진 함수에서 오류가 발생해선 안된다.


### Null을 함수 인자로 전달하지 않는다.

null로 지나치게 유연한 메서드를 만들지 말고 **명시적인 메서드/함수를 만들어야 한다**.  

- 함수나 객체의 인자로 null 을 전달하는 것은 피한다.

```ts
// bad

function mainFunction() {
  let value: string | null = getNullableValue();
  nullableFunction(value); 
  ...
}

function nullableFunction(input: string | null) {
  console.log(input.length);
}
```

```ts
// bad or good?
function mainFunction() {
  let value: string | null = getNullableValue();
  if(value !== null) {
    nunnullFunction(value);
  }
  ...
}

function nunnullFunction(input: string) {
  console.log(input.length);
}

// bad or good?
function mainFunction() {
  let value: string | null = getNullableValue();
  nunnullFunction(value);
  ...
}

function nunnullFunction(input: string) {
  if(value !== null) {
    console.log(input.length);
  }
}
```

- `nunnullFunction` 에서 null 체크를 하더라도, 그 아래 코드들에서 `value`가 null이면 문제가 발생할 수 있다.
- 함수 내부 전체에서 사용해야하는 값이라면 값을 가져오자마자 null 체크를 하고, 그 이후로는 null 체크를 하지 않는다.

```ts
// good
function mainFunction() {
  let value: string | null = getNullableValue();
  if(value === null) {
    return;
  }
  nunnullFunction(value);
...
}

function nunnullFunction(input: string) {
  console.log(input.length);
}

```

#### 외부에서 전달 받는 값일 경우

사용자의 입력, DB의 조회, API 조회 결과 등 외부의 입력으로 `null` 일 수 있다.  
이럴 경우 `null` 을 전달 받은 가장 가까운 곳에서 `null` 을 처리하고, 그 이후로는 `null` 을 전달 받지 않는다.


### 명확한 초기값을 설정한다.

- 초기화 시점과 실행 시점이 겹치지 않아야 한다

```ts
class BadExample {
    instanceVariable: string | null = null;

    constructor() {
        this.instanceVariable = this.getNullableValue(); 
        // 초기화 시점과 실행 시점이 겹침: 생성자에서 초기화하면서 메소드를 실행
        console.log(this.instanceVariable.length); // Null Pointer Exception 발생 가능성
    }

    getNullableValue(): string | null {
        // null이나 non-null 값을 반환
        return null; // 예시를 위해 항상 null 반환
    }
}

class GoodExample {
    instanceVariable: string | null = null;

    constructor(input: string | null) {
        this.instanceVariable = input; 
        // 초기화 시점과 실행 시점이 분리: 객체 생성 시점에 값을 설정하고, 나중에 메소드를 실행
    }

    execute(): void {
        if (this.instanceVariable !== null) {
            console.log(this.instanceVariable.length);
        } else {
            // 적절한 예외 처리
        }
    }
}

let value: string | null = getNullableValue();

let goodExample = new GoodExample(value);
goodExample.execute();
```

- 실행 시점에 null인 필드는 초기화되지 않았다는 의미가 아닌, 값이 없다는 의미여야 한다.
- 실행 시점엔 초기화되지 않은 필드가 없어야 한다

```ts
class Item {
    private name: string;
    private price: number;

    constructor() {
        this.name = '';
        this.price = 0;
    }

    initialize(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    purchase(quantity: number): number {
        return this.price * quantity;
    }
}
```

```ts
let myItem = new Item(); 
// 초기화 시점: name은 빈 문자열이고, price는 0입니다.
myItem.initialize('Apple', 150); 
// 실행 시점: 여기서 'Apple'로 name을 설정하고, 150으로 price를 설정합니다.

let total = myItem.purchase(3); 
// 실행 시점: 여기서 purchase 메서드를 사용하여 총 금액을 계산합니다.
console.log(total); // 출력: 450
```

- 지연 초기화(lazy initialization) 필드의 경우 팩토리 메서드로 null 처리를 캡슐화 하라
  - null 처리 로직을 팩토리 메서드 내부로 숨기는 것을 의미합니다. 이 원칙을 따르면 null 처리 로직이 전체 코드에 퍼져 있지 않고 한 곳에 모여있게 되므로 가독성과 유지보수성이 향상된다.


## 마무리

엘비스 연산자(`?.`) 는 무분별한 Null 값 사용을 부추기니 조심해야한다.

Null 의 범위를 좁히는 방법
 - Pre Condition (사전 조건 체크)
 - Null 반환 금지
     - throw Error
     - return Null Object
 - Null 함수 인자 전달 금지
 - 초기값과 실행값 구분

## 함께 보면 좋은 글

- [is_left vs left_at vs left_status](https://jojoldu.tistory.com/577)
- [Number와 boolean 은 최대한 Not Null로 선언하기](https://jojoldu.tistory.com/718)
- [좋은 API Response Body 만들기](https://jojoldu.tistory.com/720)


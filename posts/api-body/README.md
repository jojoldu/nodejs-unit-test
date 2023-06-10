# 좋은 API Response Body 만들기

기존 SSR 시스템(jquery + Server Template)을 API 기반의 신규 시스템으로 전환하는 작업을 하면서 팀의 백엔드 개발자분들게 Response Body 관해서 종종 코멘트를 한다.  
  
이런 코멘트들이 쌓이다보니 그냥 한번에 사내 위키로 정리하는게 좋겠단 생각에 먼저 블로그에 정리하게 되었다.  

> 일반적인 내용들 + 팀 전용 내용들을 다 같이 담아서 사내 위키에 남기려고.

정답이 있는 것은 아니지만, 개인적으로 선호하는 Reponse Body 규칙들이 있다.  
API 역시 **사용자 인터페이스**이다.  
  
인터페이스라는 측면을 무시하고, **내가 편한 방법, 혹은 기준 없이** API의 Body를 만들다보면 정작 사용해야하는 쪽에서 불편할때가 많다. (사용자 인터페이스임에도 불구하고 말이다)  
  
그래서 내 기준의 API Response Body 들을 정리해보게 되었다.  

> 아래는 개인적 관점이라서 사람마다 다를 수 있습니다.
> 만약 다른 부분이 있다면 댓글로 의견을 남겨주신다면 저도 배울 수 있는 좋은 기회가 될 것 같습니다.

## 1. 직관적인 데이터 

### camelCase 사용하기

```js
// bad
{
    group_name: 'inflab'
}

// good
{
    groupName: 'inflab'
}
```

많은 언어에서 camelCase를 관례처럼 사용하고 있기 때문에 Response Body의 필드들을 camelCase를 사용하면, **다양한 플랫폼과 언어에서도 일관성을 유지할 수 있다**.  
  
특히 OpenAPI 스펙에서는 **자동으로 코드를 생성할 수 있는 도구** (`codegen`) 를 많이 제공하고 있다.  

- [TypeScript codegen](https://www.npmjs.com/package/openapi-typescript)
- [graphql codegen](https://the-guild.dev/graphql/codegen)
- [React Native codegen](https://reactnative.dev/docs/next/the-new-architecture/pillars-codegen)

이런 도구들은 주로 camelCase를 따르는 언어 (예: JavaScript, Java 등)에 많이 최적화 되어있다.  
  
Response Body의 각 properties를 camelCase로 사용하면 이런 도구들을 효과적으로 활용할 수 있다.  
일관성이나 codegen 등의 도구를 고려한다면 `camelCase` 로 구현하는것이 다른 case들 보다 낫다.

### 표준 포맷 사용하기

API의 데이터는 누가 봐도 **직관적으로 무슨 데이터인지 이해할 수 있는 형태**여야 한다.  
예를 들어, (특별한 이유가 없는 한) **UNIX 타임스탬프 등을 날짜 데이터로 사용하면 안된다**.  

일시 등의 날짜 데이터는 [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) 혹은 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 정의된 날짜 및 시간 형식을 사용한다.

- 일자: `2015-05-28`
- 일시: `2015-05-28T14:07:17` 혹은 `2015-05-28 14:07:17`

```js
// bad

{
    createdAt: 1423314000
}

// good

{
    createdAt: '2015-02-07T13:00:00'
}
```

## 2. 타입이 의미하는 바를 명확하게 사용하기

### Boolean 타입에는 `null` 이 있으면 안된다.

Boolean 은 기본적으로 **참과 거짓 두 값의 열거형**과 다를바 없다.  
의미 있는 `null` 값이 있는 경우라면 Enum 으로 대체하는 것이 좋다.  
예를 들어 `null`, `true`, `false` 에 각각 의미가 있다면 `YES`, `NO`,  `UNKNOWN` 으로 표현하는 것이 더 좋다.

```js
// bad

{
    isPassed: null // or true or false
}

// good

{
    passStatus: 'READY' // PASS or FAIL
}
```

### 제한된 문자열 값은 Enum 으로 표현한다.

Enum 은 제한된 문자열 값의 집합을 의미한다.
`ADMIN`, `MANAGER`, `USER` 와 같이 제한된 문자열 값이 있는 경우 Enum 으로 표현하는 것이 좋다.
단순 문자열로 표현할 경우 무슨 값이든 나올 수 있음을 의미하기 때문에 **사용자 측에서 값을 예상하기 힘들다**.  
  
**제한된 값 외에는 받을 수 없음**을 표현해야 한다.

### 열거형 (Enum) 은 문자열로 표현되어야 한다.

Enum은 기본적으로 ordinal 값을 가지고 있으며, ordinal은 숫자값이다.  

ordinal은 Enum의 순서를 의미하며, **Enum의 순서가 바뀌면 ordinal 값도 바뀐다**.  
특히 어떤 값을 의미하는지 명확하지 않다.

```js
// bad

{
    passStatus: 1
}

// good

{
    passStatus: 'READY'
}
```

## 3. 빈값 처리

### null 보다는 Null Object Pattern


- 목록 결과가 없을 경우 `null` 보다는 빈배열 `[]` 을 반환한다.
- 단일 결과가 없을 경우 `null` 보다는 [Null Object](https://en.wikipedia.org/wiki/Null_object_pattern)를 반환한다.

`{}` 와 같은 전용 Null 객체를 사용하여 Null 케이스를 표현하는 것이 더 안전합니다.

### 값이 없는 경우에 대해 명시하기

## 4. 네이밍

### 일관성 유지하기

어디서는 Number이고 어디서는 No이면 안된다.  
API의 필드명은 예측 가능 해야한다.  
그럴려면 일관성을 유지해야한다.

```js
// bad

{
    accountNumber: '0012571125123',
    bankNo: '012'
}

// good
{
    accountNo: '0012571125123',
    bankNo: '012'
}
```

이는 응답 필드 내부에서만 유지해서는 안되며, **요청 필드와 응답 필드 간에도 네이밍에는 일관성**을 유지해야 한다.

### 축약 금지

속성명을 축약하지 않는다.
예를 들어 

- count -> `cnt`
- name -> `nm` 

등으로 축약하면 작업자 외에는 해당 속성의 정확한 용도를 알 수가 없다.

### At 접미사를 사용하여 날짜/시간 속성 이름 지정

일시 속성은 매우 유사하거나 심지어 동일한 이름을 갖는 부울 속성과 구별하기 위해 `At` 로 끝나야 한다.

- `created` -> `createdAt`
- `modified` -> `modifiedAt`
- `deleted` -> `deletedAt`

### 배열등 복수형은 복수형 이름으로

복수형은 복수형 이름으로 지정해야 한다.

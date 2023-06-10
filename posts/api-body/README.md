# 좋은 API Response Body 만들기

기존 SSR 시스템(jquery + Server Template)을 API 기반의 신규 시스템으로 전환하는 작업을 하면서 팀의 백엔드 개발자분들께 Response Body 관해서 종종 코멘트를 한다.  
  
이런 코멘트들이 쌓이다보니 그냥 한번에 사내 위키로 정리하는게 좋겠단 생각에 먼저 블로그에 정리하게 되었다.  

> 일반적인 내용들 + 팀 전용 내용들을 다 같이 담아서 사내 위키에 남기려고.

정답이 있는 것은 아니지만, 개인적으로 선호하는 Reponse Body 규칙들이 있다.  
API 역시 **사용자 인터페이스**이다.  
  
인터페이스라는 측면을 무시하고, **내가 편한 방법, 혹은 기준 없이** API의 Body를 만들다보면 정작 사용해야하는 쪽에서 불편할때가 많다.  
(사용자 인터페이스임에도 불구하고 말이다)  

내가 선호하는 API Response Body 기준이다.  

> 아래는 개인적 관점이라서 사람마다 다를 수 있습니다.
> 만약 다른 부분이 있다면 댓글로 의견을 남겨주신다면 저도 배울 수 있는 좋은 기회가 될 것 같습니다.

## 최소 스펙 유지하기 (YAGNI)

가능한 **API의 크기를 최소화**한다.  
API에 **신규 필드를 넣는 것은 전혀 어렵지 않다**.  
기존 사용자들에게 전혀 영향을 끼치지 않으면서 추가할 수 있다.  
하지만, **이미 존재하는 필드를 수정/삭제 하는 것은 너무나 어렵다**.  
버저닝부터 시작해서 신경써야할 것들이 많다.  

API를 만들때는 현재 필요한 것들만 포함시킨다.  
항상 필요 스펙에 한해서만 추가하며, **확실하지 않은 필드를 미리 추가하지 않는다**.  
**사용하지 않는 필드가 확실하다면 해당 필드는 꼭 삭제**한다.  
  
## camelCase 사용하기

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
  
Response Body의 각 필드를 camelCase로 사용하면 이런 도구들을 효과적으로 활용할 수 있다.  
일관성이나 codegen 등의 도구를 고려한다면 `camelCase` 로 구현하는 것이 다른 case들 보다 낫다.  
  
우리팀의 컨벤션과 다른 것이 문제가 아니라, 이 API를 호출하는 사용자 측에게 어떤 것이 더 편할지 고려한다면 가능한 많은 사용자들이 혜택을 볼 수 있는 `camelCase`를 선택한다.  

> 물론 내부 시스템간의 API 통신이며, `codegen` 등의 도구를 쓰지 않을거라면 사내 기준에 맞춘다.

## 표준 포맷 사용하기

API의 데이터는 누가 봐도 **직관적으로 무슨 데이터인지 이해할 수 있는 형태**여야 한다.  
예를 들어, (특별한 이유가 없는 한) **UNIX 타임스탬프 등을 날짜 데이터로 사용하면 안된다**.  
일시 데이터로 `1423314000` 로 오면 경험 있는 프로그래머 외에는 이 값이 무엇을 뜻하는지 바로 알아채기 어렵다.  
특히 `2010-01-04T13:55:23.975` 와 같이 `ms` 단위까지 표기가 필요하다면 UNIX 타임스탬프로는 더 혼란스럽다.

가능하면 일시 등의 날짜 데이터는 [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) 혹은 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 정의된 날짜 및 시간 형식을 사용한다.

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

## Boolean 타입에는 `null` 이 있으면 안된다.

Boolean 은 기본적으로 **참과 거짓 두 값의 열거형**과 다를바 없다.  
의미 있는 `null` 값이 있는 경우라면 **Enum 으로 대체**하는 것이 좋다.  
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

## 제한된 문자열 값은 열거형 (Enum) 으로 표현한다.

Enum 은 제한된 문자열 값의 집합을 의미한다.
`ADMIN`, `MANAGER`, `USER` 와 같이 제한된 문자열 값이 있는 경우 Enum 으로 표현하는 것이 좋다.
단순 문자열로 표현할 경우 무슨 값이든 나올 수 있음을 의미하기 때문에 **사용자 측에서 값을 예상하기 힘들다**.  
  
(API 문서에서) **제한된 값 외에는 없음**을 표현해야 한다.

## 열거형 (Enum) 은 문자열로 표현되어야 한다.

Enum은 기본적으로 ordinal 값을 가지고 있으며, ordinal은 숫자값이다.  

ordinal은 Enum의 순서를 의미하며, **Enum의 순서가 바뀌면 ordinal 값도 바뀐다**.  
특히 어떤 값을 의미하는지 명확하지 않다.  
  
Enum 을 사용할때는 항상 문자열 값을 사용해서 API에서 반환한다.

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

## 복수형 빈값은 빈 배열로

Null을 다루는 방법으로 [Null Object Pattern](https://en.wikipedia.org/wiki/Null_object_pattern) 이 있다.  
Null (`Undefined`) 대신에 대체 객체를 사용하는 패턴이다.  
우리가 흔히 사용하는 ORM들을 보면 복수형을 조회할때 **값이 없으면 빈 배열을 반환**하는데, 이게 Null Object Pattern의 대표적인 사례이다.  
이로 인해 복수형 조회시에 `Null` 혹은 `Undefined` 문제를 대응할 필요가 없어진다.  
복수형 필드는 조회 결과가 없을 경우 무조건 빈배열(`[]`)을 사용한다.
  
```js
// bad
{
    orders: null,
}

// good
{
    orders: [],
}
```

반면, 단일 객체에 Null Object Pattern을 대응 하는 것은 기존 시스템의 상황에 따라 기본값을 구현하기 어렵거나 Null 자체가 유의미한 경우가 많아 상황에 따라 선택한다.

## 일관성 유지하기

API의 필드명은 **예측 가능** 해야한다.  
같은 뜻을 나타내는 필드는 이름에 **일관성을 유지**해야한다.  
어디서는 Number이고 어디서는 No이면 안된다.  

```js
// bad
{
    accountNumber: '0012571125123', // number
    bankNo: '012' // no
}

// good
{
    accountNo: '0012571125123',
    bankNo: '012'
}
```

이는 응답 필드 내부에서만 유지해서는 안되며, **요청 필드와 응답 필드 간에도 네이밍에는 일관성**을 유지해야 한다.

```js
// bad

Request Body
{
    accountNumber: '0012571125123',
}

Response Body
{
    accountNo: '0012571125123',
}

// good

Request Body
{
    accountNo: '0012571125123',
}

Response Body
{
    accountNo: '0012571125123',
}
```

## 필드명 축약 금지

필드명을 축약하지 않는다.
예를 들어 

- count -> `cnt`
- name -> `nm` 
- table -> `tbl` 

등으로 축약하면 API를 사용하는 입장에서는 **전혀 의미를 알 수 없기 때문에** 사용해선 안된다.  

축약어 자체가 이미 모두가 알고 있는 보편적인 단어라면 사용해도 된다.

> 예를 들어 `id` 는 `Identifier` 의 축약어이지만, 모두가 그 뜻을 알고 있다. 이런 축약어는 필드명으로 선언해도 된다.

하지만 우리팀만, 우리 조직에서만 인지하고 있는 축약어라면 절대 선택하지 않고, 가능한 풀네임을 사용한다.  

## 타입에 맞는 필드명

필드가 표현하는 데이터 타입에 맞는 필드명을 사용한다.  
적절한 필드명을 선언하지 않으면 **해당 값이 채워져있을때만 그 값의 의미를 알 수 있다**.  
예를 들어, 필드명이 `discount` 이며, 해당 값이 없어서 `{discount: null}` 로 API 응답이 왔다고 해보자.  
그럼 이 필드는 할인금액을 나타내는지, 할인 여부를 나타내는지 할인 기간을 나타내는지 어떻게 알 수 있을까?  
결국 API 문서를 항상 찾아봐야만 한다.  
API 문서를 찾아보지 않더라도, 직관적으로 보자마자 알 수 있는 필드명을 사용해야만 한다.

- Boolean 타입이라면 `is`, `has` 등을 prefix로
- 일시 타입이라면 `At` 을 suffix로
- 복수형은 복수형으로

```js
// bad
{
    discount: true,
    created: '2023-06-10T14:30:00',
    order: [..],
}

// good
{
    isDiscounted: true,
    createdAt: '2023-06-10T14:30:00',
    orders: [..],
}
```

## 마무리

이런 주제들은 보통 정답이 있는 것처럼 이야기했다가는 기존에 다른 기준을 가진 팀 분들께 실례가 될 수 있기 때문에 조심스럽다.  
그래서 가능한 모든 것은 내 개인적 기준이며, 필요하면 언제든 변경/추가 될 수 있다.  
  
다만, API가 인터페이스라는 점은 분명해서 가능한 사용자가 직관적으로 바로 이해할 수 있는 스펙을 유지하려는 점이 나에겐 중요하다.  
  
당장 생각나는 것들 위주로 정리했기 때문에 코멘트가 있을때마다 이 글은 계속 업데이트 될 수 있다.  



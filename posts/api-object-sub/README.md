# 좋은 API Response Body 

API 역시 사용자 인터페이스이다.  
개발자는 API 

## 일관성 유지하기

## 사용하기 쉬운 Type과 Format

## 즉시 사용 가능한 데이터



## 타입이 의미하는 바를 명확하게 사용하기

### Boolean 타입에는 `null` 이 있으면 안된다.

Boolean 은 기본적으로 **참과 거짓 두 값의 닫힌 열거형**이다.  
콘텐츠에 의미 있는 null 값이 있는 경우 Enum 으로 대체하는 것이 좋다.  
예를 들어 `null`, `true`, `false` 에 각각 의미가 있다면 `YES`, `NO`,  `UNKNOWN` 으로 표현하는 것이 더 좋다.

### 제한된 문자열 값은 Enum 으로 표현한다.


### 열거형은 문자열로 표현되어야 한다.

Enum은 기본적으로 ordinal 값을 가지고 있으며, 이는 숫자로 표현된다.
그러다보니 숫자로 표현되기도 한다.  


## null 보다는 Null Object Pattern


- 목록 결과가 없을 경우 `null` 보다는 빈배열 `[]` 을 반환한다.
- 단일 결과가 없을 경우 `null` 보다는 [Null Object](https://en.wikipedia.org/wiki/Null_object_pattern)를 반환한다.


## 네이밍

### At 접미사를 사용하여 날짜/시간 속성 이름 지정

At날짜 및 날짜-시간 속성은 매우 유사하거나 심지어 동일한 이름을 갖는 부울 속성과 구별하기 위해 로 끝나야 합니다 .

createdAt오히려created
modifiedAt오히려modified
occurredAt오히려occurred
returnedAt오히려returned

### 배열등 복수형은 복수형 이름으로


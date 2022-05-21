# 테스트하기 좋은 코드

아래는 JS/TS 컨텐츠는 아니지만(C#, Java) 테스트하기 좋은 코드에 대해 좋은 대답을 해준 컨텐츠이다.  
이 글 외에도 추가로 내용이 궁금하다면 꼭 참고해보길 추천한다.

* [정진욱 - Testing, Oh my!](https://jwchung.github.io/testing-oh-my)
* [권용근 - 무엇을 테스트할 것인가](https://www.youtube.com/watch?v=YdtknE_yPk4)

> 뒤에서 이어서 쓸 Active Record vs Data Mapper의 빌드업이기도 하다.

Cypress, Supertest 등을 통해 E2E 테스트를 작성하면 테스트 코드를 작성이 가능한데도

* 테스트 구현의 복잡함
* 빠른 피드백 불가능

## 테스트하기 좋은 코드 vs 테스트하기 어려운 코드

몇번을 수행해도 항상 같은 결과가 발생하는 순수함수
순수함수를 방행하는 2가지 큰 요소

* 제어할 수 없는 코드
  * `Random()`
  * `new Date()` 혹은 `LocalDate.now()`
  * 데이터베이스/API 등 외부에서 가져온 결과를 사용하는 코드
* 부수효과 (Side Effect)
  * 이메일 발송
  * 로깅
  * 데이터베이스 / API 등으로 데이터 전송하는 코드


그런면에 있어서 TS와 같은 언어는 **외부의 세상에 영향을 주는 것**을 `async` 로 구분할 수 있다.
`async` 함수(혹은 메소드)는 테스트하기 어려운 코드로 봐도 무방하다.
즉, `async` 함수 (혹은 메소드)를 얼마나 핵심에서 벗어나게 하느냐가 프로젝트 전체의 테스트 용이성을 결정한다.

## 

흔히 말하는 Controller-Service-Repository 패턴이라면 Repository 가 

실제로는 Controller -> Service -> Domain <- Repository 가 된다.
즉, 

### BE

DB에서 값을 가져오는 코드

### FE

Cookie 나 로컬 스토리지를 통해 값을 가져오는 코드

## 

다음과 같이 시그널을 캐치할 수 있다.

> private 메소드가 많다면 클래스로 분리하는 것을 고려해보자


# 

특히나 단위 테스트를 작성할때면 대부분이 `jest.mock` 혹은 `mockImplements` 를 많이들 활용한다.  


* Mock: 행위 (`behavior`) 를 검증
* Stub: 상태 (`state`) 를 검증


### Why ts-mockito

이와 관련해서는 별도 포스팅에서 좀 더 자세한 사용법을 공유하겠습니다. 

[Testing your TypeScript code with ts-mockito](https://medium.com/passionate-people/testing-your-typescript-code-with-ts-mockito-ac439deae33e)

* ts-mockito에서 jest mock에 비해 훨씬 더 간결한 구문입니다. 또한 Java Mockito 라이브러리에 대한 경험이 있다면 집과 같은 편안함을 느낄 것입니다.
* ts-mockito에서 훨씬 더 리팩터링/IDE 친화적인 API
* 프레임워크 독립 - 언젠가 다른 테스트 러너(예: Karma, Cypress)로 마이그레이션하려는 경우 모든 jest.mocks 및 ts-mockito 모의를 교체해야 합니다.

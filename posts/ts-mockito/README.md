# jest.mock 보다 ts-mockito 사용하기

NodeJS 기반의 백엔드에서는 [NestJS](https://docs.nestjs.com/providers#dependency-injection), [routing-controllers](https://github.com/typestack/routing-controllers) 등 최근 대세가 되는 MVC 프레임워크들이 모두 Class를 기반으로 한 DI (Dependency Injection) 



[Testing your TypeScript code with ts-mockito](https://medium.com/passionate-people/testing-your-typescript-code-with-ts-mockito-ac439deae33e)

* ts-mockito에서 jest mock에 비해 훨씬 더 간결한 구문입니다. 
* Java Mockito 라이브러리에 대한 경험이 있다면 집과 같은 편안함을 느낄 것입니다.
* ts-mockito에서 훨씬 더 리팩터링/IDE 친화적인 API
* 프레임워크 독립 - 언젠가 다른 테스트 러너(예: Karma, Cypress)로 마이그레이션하려는 경우 모든 jest.mocks 및 ts-mockito 모의를 교체해야 합니다.

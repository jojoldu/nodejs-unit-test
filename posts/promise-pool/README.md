# Promise Pool로 성능 개선하기

## 주의

실제 서비스에서 대규모의 트래픽 상태에서 검증한 것이 아니고 한정된 자원내에서의 성능 테스트이기 때문에 실제 서비스 적용전에는 충분한 검증이 필요합니다.

## 개요

비동기를 레일로 만들어서 작동시킨다는 것을 이걸 보통 Promise Pool 이라고 합니다.
데이터베이스의 Connection Pool처럼 Promise 객체를 Pool로 관리한다고 하여
보통 너무 많은 Promise객체들을 처리해야할때 Chunk 단위로 쪼개서 하게 되는데요.
이렇게 되면 각 chunk 단위의 가장 긴 작업들의 총합이 곧 총 작업시간이 됩니다.


하지만 Promise Pool로 처리하면
Pool 안에서 끝나는대로 그 빈자리를 계속해서 채워서 처리하기 때문에 성능 개선이 가능합니다.


예를 들어 데이터베이스에 부담을 주지 않기 위해 4개의 프로미스만 동시에 실행되도록 허용하는 등 동시성을 제어하고 싶다고 가정해 보겠습니다. 어떻게 할 수 있을까요?

Promise.all()은 이 점에서 제한적입니다.

해결책은 프로미스 풀을 사용하는 것입니다.

많은 프로미스 풀 라이브러리가 있지만, @supercharge/promise-pool은 다른 라이브러리보다 제가 선호하는 멋진 API를 제공합니다.

https://github.com/supercharge/promise-pool
https://github.com/timdp/es6-promise-pool
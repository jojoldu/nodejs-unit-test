# 5. 테스트하기 좋은 코드 - SQL

지난 시간까지 애플리케이션 코드를 어떻게 개선하면 좋을지에 대해 이야기를 나눴다.

[1. 테스트하기 어려운 코드](https://jojoldu.tistory.com/674)  
[2. 제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)  
[3. 외부에 의존하는 코드 개선](https://jojoldu.tistory.com/680)  
[4. 검증이 필요한 비공개 함수 개선](https://jojoldu.tistory.com/681)  

이번 편에서는 애플리케이션 코드가 아닌 Query (비단 RDBMS뿐만 아니라 NoSQL도 해당) 에 대해서 이야기를 해본다.  
  
최근엔 ORM (혹은 ODM) 사용이 대중화되었지만, 여전히 많은 프로젝트에서는 SQL Builder를 통해서 Native Query를 작성한다.  

SQL Builder를 통해서 Native Query를 작성하는 것은 복잡한 조회 조건이 필요한 환경에서는 굉장히 효율적인 방법이다.  
예를들어, 통계/정산/물류 등 복잡한 조회 Query가 필요하거나, 쿼리 성능 개선이 필요한 경우 등등의 경우이다.    
  
다만, 그런 Native Query 환경에서도 테스트 하기 좋은 방법이 있고, 아닌 방법은 분명히 있다.  
  
이번엔 이에 대해 이야기를 나눠보자. 

## 5-1. 문제 상황

예를 들어 다음과 같은 기존의 코드가 있다고 가정해보자.  
물론 굉장히 간단한 코드이지만, 예시로 든 것이며, 실제로는 이보다 더 복잡한 쿼리가 사용되었다고 가정하면 된다.

```ts
export class BlogRepository {
	...
	async getBlogs() {
		return queryBuilder.query(`
			SELECT *
			FROM blog
			WHERE publish_at <= NOW()
		`);
	}
}
```

이 코드는 다음과 같은 로직을 가지고 있다.

* 발행일이 현재보다 과거인 블로그 글을 모두 가져온다.

이 테스트는 왜 테스트 작성이 너무나 어려운것일까?

* 실행할때마다 변경되는 현재 시간 SQL 함수 (`NOW()`) 를 쿼리 내부에서 쓰고 있다

제어할 수 없는 값 (`NOW()`) 에 함수가 깊게 의존하고 있기 때문이다.

* 참고: [2. 제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)  

이외에도 

## 5-2. 해결 방법


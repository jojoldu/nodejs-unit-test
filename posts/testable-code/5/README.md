# 5. 테스트하기 좋은 코드 - SQL

지난 시간까지 애플리케이션 코드를 어떻게 개선하면 좋을지에 대해 이야기를 나눴다.

[1. 테스트하기 어려운 코드](https://jojoldu.tistory.com/674)  
[2. 제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)  
[3. 외부에 의존하는 코드 개선](https://jojoldu.tistory.com/680)  
[4. 검증이 필요한 비공개 함수 개선](https://jojoldu.tistory.com/681)  

이번 편에서는 애플리케이션 코드가 아닌 Query (비단 RDBMS뿐만 아니라 NoSQL도 해당) 에 대해서 이야기를 해본다.  
  
최근엔 ORM (혹은 ODM) 사용이 대중화되었지만, 여전히 많은 프로젝트에서는 SQL Builder를 통해서 Native Query를 작성한다.  
SQL Builder를 통해서 Native Query를 작성하는 것은 복잡한 조회 조건이 필요한 환경에서는 굉장히 효율적인 방법이다.  
예를 들어, 통계/정산/물류 등 복잡한 조회 Query가 필요하거나, Bulk Insert등 쿼리 성능 개선이 필요한 경우에 Native Query가 계속 필요하다.      
  
다만, 그런 Native Query 환경에서도 테스트 하기 좋은 방법이 있고, 아닌 방법은 분명히 있다.  
  
이번엔 이에 대해 이야기를 나눠보자. 

## 5-1. 문제 상황

예를 들어 다음과 같은 기존의 코드가 있다고 가정해보자.  
물론 굉장히 간단한 코드이지만, 예시로 든 것이며 실제로는 이보다 더 복잡한 쿼리가 사용되었다고 가정하면 좋다.

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

* 발행일이 **현재보다 과거인** 블로그 글을 모두 가져온다.

너무나 간단한 로직이라 큰 문제가 없어 보이지만, 이 코드는 테스트 코드를 작성하기에 어려운 부분이 있다.    
정확히는 **테스트로 검증하기가 어렵다**.

* 실행할때마다 변경되는 **현재 시간 SQL 함수** (`NOW()`) 가 쿼리 내부에 존재

지난 글 ([2. 제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)) 에서도 언급했지만, 테스트 대상 내부에 **제어할 수 없는 코드**가 있으면 테스트 코드를 작성하기가 어렵다.  
  
마찬가지로, 이 메소드 역시 제어할 수 없는 값 (`NOW()`) 이 **쿼리 내부**에 존재한다.  
  
이와 비슷하지만,  코드는 흔하게 볼 수 있다.  
예를 들어 **-7일 전까지 발행된 모든 블로그글을 조회**하는 메소드를 구현한다고 하면 다음과 같이 구현되기도 한다.

```ts
export class BlogRepository {
	...
	async getBlogs() {
		return queryBuilder.query(`
			SELECT *
			FROM blog
			WHERE publish_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
		`);
	}
}
```


## 5-2. 해결 방법

```ts
export class BlogRepository {
	...
	async getBlogs(now: LocalDateTime) {
		return queryBuilder.query("
			SELECT *
			FROM blog
			WHERE publish_at <= :now", { 
				now: now.toDate() 
			}
		);
	}
}
```

* Node ORM에서는 `Date` 타입만 허용하기 때문에 `Date` 치환이 필요하다.

```ts
export class BlogRepository {
	...
	async getBlogs(startedAt: LocalDateTime, endedAt: LocalDateTime) {
		return queryBuilder.query("
			SELECT *
			FROM blog
			WHERE publish_at BETWEEN :startedAt AND :endedAt", { 
				startedAt: startedAt.toDate(),
				endedAt: endedAt.toDate()
			}
		);
	}
}
```

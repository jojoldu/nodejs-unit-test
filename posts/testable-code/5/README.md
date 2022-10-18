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

너무나 간단한 로직이라 큰 문제가 없어 보이지만, 이 코드에는 몇가지 문제가 있다.

* 실행할때마다 변경되는 **현재 시간 SQL 함수** (`NOW()`) 가 쿼리 내부에 존재
* **오늘**이라는 조건이 고정되어있어, **특정 일자의 조회**와 같은 기능 확장에 취약

지난 글 ( [2. 제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)) 에서도 언급했지만, 테스트 대상 내부에 **제어할 수 없는 코드**가 있으면 테스트 코드를 작성하기가 어렵다.  
  
더군다나 `2022-10-28` 과 같은 특정일자의 조회, 한달전과 같은 다른 조건의 조회 등으로 메소드가 확장될 여지 조차 없다.  
  
비슷한 사례로 다음과 같이 오늘부터 일주일전까지라는 조회를 구현할때 다음과 같이 구현하는 것 역시 문제가 된다.

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

여기서 **-7일이라는 비즈니스 로직이 쿼리 내부에 존재**한다.  
이럴 경우 마찬가지로 하루, 2주, 한달 등으로 조건이 변경되면 해당 메소드는 재활용이 어렵고, -3일에서 -10일이라는 조건 등으로도 재활용이 어렵다.  

## 5-2. 해결 방법

위 문제를 해결하는 방법은 간단하다.  
**쿼리문 내에서 비즈니스 로직을 파라미터로** 받는다.  
이렇게 하면 쿼리는 고정되더라도, 테스트 코드를 작성할때도, 메소드를 재활용할때도 쉽다.

```ts
export class BlogRepository {
	...
	async getBlogs(now: LocalDateTime) {
		return queryBuilder.query("
			SELECT *
			FROM blog
			WHERE publish_at <= :now", { 
				now: now.toDate() // Date로 변환
			}
		);
	}
}
```

* Node.js ORM에서는 `Date` 타입만 허용하기 때문에 `Date` 변환이 필요하다.
* `getBlogs`의 파라미터로 `Date`를 받아도 되지만, `LocalDateTime` 으로 받은 이유는
  * 프로젝트 전체에서 js-joda의 `LocalDateTime`을 표준 날짜 타입으로 쓰고 있다.
  * `Date`가 필요한 영역은 오직 RDBMS의 SQL 실행시에만 필요하다.
  * 만약 최종 저장소가 RDBMS가 아니라 분산된 다른 서비스 **API로 문자열**을 보내야한다면 `Date`가 아니라 `string`으로 받아야 한다.
  * 프로젝트의 표준 타입을 사용하고, 해당 함수 (혹은 컴포넌트)에서만 필요한 타입은 해당 함수 내부에서 변환해서 사용하는 것이 좋다.
  * 테스트 코드를 작성할때 역시, `getBlogs` 파라미터로 `Date` 보다는 `LocalDateTime`이 좋다.

마찬가지로 비즈니스 로직을 가지고 있는 메소드 역시 파라미터로 처리한다.

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

이렇게 할 경우 테스트 코드 작성이 쉬워지며, 메소드를 재활용하기도 쉬워진다.
## 마무리

SQL에서 직접 데이터를 처리하거나 로직(`NOW()`, `DATE_SUB()`, `PASSWORD()` 등)을 담고 있으면 테스트 구현과 기능 확장에 취약하다.  
가능하다면 SQL에서는 로직을 담지 말고, **저장소로서의 역할에만** 충실하도록 구현하는 것이 좋다.
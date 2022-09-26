# 3. 테스트하기 좋은 코드 - 외부에 의존하는 코드 개선

지난 시간에 테스트하기 좋은 코드에 대해 이야기를 나눴다.

(1) [테스트하기 어려운 코드](https://jojoldu.tistory.com/674)  
(2) [제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)
  
이번 편에서는 테스트하기 어려운 코드를 개선하는 2번째 방법인 **외부에 의존하는 코드를 개선**하는 방법에 대해 이야기를 해보자.    
  
## 3-1. 문제 상황

[1부](https://jojoldu.tistory.com/674) 에서 소개했던 `cancel()` 코드를 다시 보자. 

```ts
export default class Order {
    ...
    async cancel(cancelTime): void {
        if(this._orderDateTime >= cancelTime) {
            throw new Error('주문 시간이 주문 취소 시간보다 늦을 수 없습니다.');
        }
        const cancelOrder = new Order();
        cancelOrder._amount = this._amount * -1;
        cancelOrder._status = OrderStatus.CANCEL;
        cancelOrder._orderDateTime = cancelTime;
        cancelOrder._description = this._description;
        cancelOrder._parentId = this._id;
        
        await getConnection()
          .getRepository(Order)
          .save(cancelOrder);
    }
}
```


> 위 코드와 같은 패턴을 [Active Record 패턴](https://www.thoughtfulcode.com/orm-active-record-vs-data-mapper/) 이라고 한다.  
> 아래에서 언급하는 문제점들로 인해 **Active Record 패턴을 선호하지 않는다**.  
> Active Record와 Data Mapper 패턴 모두를 지원하는 [TypeORM](https://orkhan.gitbook.io/typeorm/docs/active-record-data-mapper)을 사용할때도 **Active Record 패턴은 금지하고, Data Mapper 패턴을 쓰도록 권장**하는 편이다.

(이전 글에서 언급했지만) 이 로직은 크게 3가지 기능을 담고 있다.

* 주문 취소 시간이 주문 시간 보다 뒤에 있는지 검증하는 로직
* 주문 정보를 기반으로 취소 주문 생성
  * 주문취소금액은 `원 주문 금액 x -1` 이어야 한다
  * 주문 상태는 `OrderStatus.CANCEL` 이어야 한다
  * 주문 취소 시간은 입력 받은 값을 사용한다
  * 나머지 상태는 원 주문을 따라간다.
* 데이터베이스에 생성된 취소 주문 1건 저장

이 3가지 기능에서 발생하는 문제점은 크게 4가지다.

### 문제점 1. 복잡한 테스트 환경 구축

이 `cancel()` 을 위한 테스트 코드는 어떤걸 작성 해야할까?

* 테스트용 데이터베이스를 실행한다.
* `order` 테이블을 비롯한 연관된 테이블을 생성한다.
* 취소하기 위한 `order` 테이블의 row를 생성한다.
* `order.cancel()` 을 수행한다.
* 데이터베이스에서 취소 주문 데이터를 조회해서 결과를 검증한다.
* 테스트가 끝났기 때문에 데이터베이스를 종료한다.
  * 전체 테스트가 수행중이라면, 다른 테스트에 영향을 주지 않기 위해 `order` 테이블의 데이터를 모두 리셋시킨다.

실제 테스트 코드로 본다면 다음과 같다.

```ts
describe('Order', () => {

    beforeAll(async () => {
      await setupTestingModule();
      await createDatabase();
      await createTable();
    });

    afterAll(async () => {
      await databaseConnection().close();
    });

    beforeEach(async () => {
      allRepository().clear();
    });

    it('주문 취소시 최소 주문이 생성된다', () => {
      //given
      const sut = await orderRepository.save(createOrder());

      // when
      sut.cancel();

      // then
      const result = await orderRepository.findOne(orderId);
      expect(~~)
    });
});
```

> 물론 TypeORM, Spring Data JPA (Hibernate) 등과 같이 최신의 ORM은 Entity 생성이 자동으로 지원하기 때문에 굳이 테이블생성이 코드상에 포함될 일은 별로 없다.  
> 다만, 어노테이션 (`@SpringBootTest`, `@DataJpaTest`)로 외부 의존성까지 포함한 통합 테스트 환경이 구축 수월한 Spring Boot + JPA 와 달리 NestJS + TypeORM의 경우 **데이터베이스가 포함된 통합 테스트 환경 구축에 해야할 일이 많다**.
> `createTestingModule` 을 통해 테스트 모듈을 생성하고, `import`, `provider` 를 일일이 지정해야하는 것 때문에 훨씬 더 많은 코드가 필요하다.

위 테스트 코드에서 우리에게 필요한 것은 **취소 주문이 원하는 형태로 만들어지는 것**이다.  
하지만, 주문 데이터를 데이터베이스에 저장하고, 생성된 주문 정보를 검증하기 위해 다시 데이터베이스에서 조회해오는 작업이 필요하다.  
테스트 환경 구축 역시 `NestJS` 의 TestingModule 을 생성하고, 각종 데이터베이스 작업을 추가해야만 한다.  
  
검증 대상인 `order.cancel()` 을 위해 테스트 코드는 이만큼의 일을 해야만 한다.  
간단한 주문 취소 정보를 생성하는 로직인데도 **테스트 환경 구축에 많은 리소스가 필요**하다.  

### 문제점 2. 낮은 테스트 리팩토링 내구성

또 하나의 문제는 낮은 리팩토링 내구성이다.  
  
이 테스트 코드는 **외부 의존 대상이 교체될 때**마다 많은 변화가 필요하다.  
    
만약 로직의 마지막 단계가 RDBMS로 저장하는 것이 아니라 아래와 같이 **다른 저장소를 사용하는 방법으로 변경**된다고 가정해보자. 

* 외부 API 호출로 변경되어야 한다면 
* NoSQL 등의 다른 데이터 솔루션으로 변경되어야 한다면
* JSON 파일로 변경해서 S3 업로드로 변경되어야 한다면


메소드의 마지막이 RDBMS라는 외부 의존성에 저장하는 기능이기 때문에 테스트 코드 역시 RDBMS라는 외부 의존성에서 결과물을 가져오는 것이 유일한 검증방법이다.  
  
**마지막 검증 단계가 RDBMS에서 데이터를 꺼내와 비교**하는 현재의 방법이라면 외부 의존성이 교체만 되어도 모든 테스트는 수정 대상이다.  
  
취소 주문 생성이라는 로직을 검증하는 테스트 코드이지만, **최종 저장하는 장소가 변경됨에 따라 테스트 코드 전반이 영향을 받게 된다**.  
그만큼 **테스트 리팩토링 내구성**이 떨어짐을 의미한다.  

### 문제점 3. 지키기 어려운 일관성

좋은 함수/메소드는 **언제 실행해도 동일한 결과를 반환한다**.  
외부 시스템에 의존하고 있다면 **외부의 상황에 따라 언제든 다른 결과가 반환**된다.  
**테스트 수행시 RDBMS에 어떤 데이터가 저장되어있냐에 따라** 같은 테스트 코드이지만 다른 결과를 반환할 수 있다.  
  
예를 들어, 유니크 제약 조건으로 인해 **다른 테스트로 인해 적재된 데이터와 충돌이 나서** 테스트가 깨질 수도 있다.  
어떤 테스트가 먼저 수행되느냐에 따라 테스트 결과가 상이할 수 있다는 것이다.  
  
모든 테스트는 **언제 수행해도 동일한 결과가 반환되어야 한다**.  

### 문제점 4. 느린 테스트

너무나 당연하지만, RDBMS를 비롯한 **외부 의존성이 있는 테스트는 수행속도가 느리다**.  
테스트 환경에서 데이터베이스를 실행하고, 기존에 적재된 데이터가 있다면 테스트 수행전에 비워두어야 하고, 매 테스트마다 대상 객체로 인해 `insert`, `update` 쿼리가 수행되어야하고, 테스트가 끝나면 데이터베이스를 종료해야 하는등 의 작업으로 인해 도저히 테스트가 빠를 수가 없다.  
  
느린 테스트가 많을수록 개발자들은 테스트 코드의 실효성에 대해 고민하게 된다.  
내가 작성한 테스트 코드들의 전체 수행 시간이 3분, 5분 등이 걸린다면 점점 테스트 코드를 작성하는 것을 꺼려하게 되고, CI 환경에서의 테스트 수행만 진행된다.


## 3-2. 해결 방법
  
위 4가지 문제점의 원인을 생각해보자.  
RDBMS에 저장하는 로직을 제외하면 나머지들은 검증하기가 쉽다.  
결국 모든 문제가 **로직 안에 외부 의존성이 포함되어있기 때문**이다.  
  
원인을 알고 있으니, 해결 방법은 쉽다.  
**외부 의존성을 로직에서 떨어뜨려 놓는 것**이다.  

```ts
export default class Order {
  ...
    cancel(cancelTime:LocalDateTime): Order {
        if(this._orderDateTime >= cancelTime) {
            throw new Error('주문 시간이 주문 취소 시간보다 늦을 수 없습니다.');
        }
        const cancelOrder = new Order();
        cancelOrder._amount = this._amount * -1;
        cancelOrder._status = OrderStatus.CANCEL;
        cancelOrder._orderDateTime = cancelTime;
        cancelOrder._description = this._description;
        cancelOrder._parentId = this._id;
        return cancelOrder;
    }
}
```

이렇게 할 경우 `cancel()`은 **외부에 영향을 받지 않는 리턴값이 있는 메소드**가 된다.  
굳이 이 메소드의 검증을 위해 **RDBMS에서 데이터를 조회할 필요도 없어진다**.  

* `throw` 가 발생하는지
* `return` 으로 의도한 결과가 넘어오는지

검증 로직, 객체 생성 로직 등 **외부 저장소에 저장하는 로직을 제외한 나머지 모든 로직의 검증이 쉬워진다**.  
  
도메인 로직이 단순화 되어서 테스트 코드가 한결 쉬워진다.

```ts
describe('Order', () => {

    it('주문 취소시 최소 주문이 생성된다', () => {
      //given
      const sut = createOrder();

      // when
      const result = sut.cancel();

      // then
      expect(~~)
    });
});
```


### BE

DB에서 값을 가져오는 코드

### FE

Cookie 나 로컬 스토리지를 통해 값을 가져오는 코드

## 마무리

만약 도메인 로직에서 `async/await` (C#, TS와 같은 언어에서) 가 필요하다면 그건 외부와의 연동이 필요한 경우이다.  
그리고 이는 테스트하기가 어렵다.  
  
즉, `async` 함수는 **도메인 로직에 최대한 거리를 두는 것이 좋다**는 것을 의미한다.  
  




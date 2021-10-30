# 테스트 픽스처 올바르게 사용하기

xUnit에서는 테스트 대상 시스템 (System Under Test, 이하 **SUT**) 를 실행하기 위해 해줘야 하는 모든 것을 **테스트 픽스처**라고 부른다.  
처음 테스트 코드를 배우게 되면 이 테스트 픽스처 부분에 대해서 완전히 오해하는 경우를 자주 본다.  
최근에 팀에 단위 테스트를 전파하고 코드리뷰를 진행하는 과정에서 다들 비슷한 오해를 하고 있는걸 발견하고 작성하게 되었다.

> 모든 코드는 TypeScript와 Jest로 작성되었다

## 1. beforeEach (setup) 등 사용할 경우

아래 코드를 보면 공통된 테스트 픽스쳐를 `beforeEach` 로 처리하였다

```typescript
describe('Order1', () => {
    let sut: Order;

    beforeEach(() => {
        sut = Order.create(1000, LocalDateTime.of(2021,10,30, 10,0,0), "배민주문");
    });

    it('주문취소1', () => {
        const cancelOrder: Order = sut.cancel(LocalDateTime.of(2021,10,31,0,0,0));

        expect(cancelOrder.status).toBe(OrderStatus.CANCEL);
        expect(cancelOrder.amount).toBe(-1000);
        expect(cancelOrder.description).toBe('배민주문');
    });


});
```

Jest 뿐만 아니라 대부분의 테스트 프레임워크에서는 이처럼 `beforeEach` 혹은 `@BeforeEach` 등을 통해 **해당 파일 혹은 클래스 내부의 함수(혹은 메소드) 들이 시작하기전에 항상 수행하는 일을 지정**할 수 있다.  

> `beforeEach` 혹은 `@BeforeEach` 등이 선언된 함수(메소드)를 `setup` 이라고 부르기도 한다.

일종의 훅 (Hook) 을 사용한 경우라 확실히 테스트 코드 중복 문제에 대처할 수 있고, 코드 길이도 줄어 코드 품질이 좋아졌다고 생각할 수 있다.  
  
하지만 이럴 경우 2가지 큰 문제점들이 발생한다. 

### 문제점 1

첫번째 문제는  **어떤 상황(테스트 픽스처)일 경우에 이 기대값이 나오는지를 한 눈에 알 수가 없다**.  
결국 테스트 메소드를 제대로 확인하려면 `setup` 함수의 코드에서 픽스처 코드를 다 봐야만 한다.

* 어떤 값을 가진 객체가 만들어진 것인지
* 어떤 함수가 어떻게 Mock / Stup 처리 되었는지 등등

setup을 통해 픽스처 구성을 허락하면 극단적으로는 다음과 같은 테스트 코드를 만나기도 한다.  
(실 사례이다)  

```typescript
    it('주문취소', () => {
        expect(sut.cancel(LocalDateTime.of(2021,10,31,0,0,0)).amount).toBe(-1000);
    });
```


만약 계속해서 서비스를 운영하게 되어, 해당 테스트 파일에 테스트 메소드가 10개가 넘고 오랫만에 테스트가 깨졌다면, 도대체 어디서부터 테스트 실패를 찾아갈 수 있을까?  
테스트 메소드는 **그 하나로 완전한 프로그램**이 되어야 한다.  
  
절대 테스트 메소드를 이해하기 위해 다른 부분을 찾아보게 만들어선 안된다.

### 문제점 2

setup을 통한 테스트 픽스처 구성의 두번째 문제로 **해당 파일 (혹은 클래스) 안에서는 모든 테스트가 서로 결합되버린다**.  
테스트 픽스처의 코드 하나만 변경해도 **모든 테스트에 영향을 미친다**.  
즉, **테스트 간의 높은 결합도**를 가지게 된다.  
  
예를 들어 다음과 같은 코드를 setup에서 구성하고 있을때

```javascript
order.addPay (Pay.of(10000));
```

아래처럼 코드를 변경하면 어떻게 될까?

```javascript
order.addPay (Pay.of(15000));
```

setup을 통하는 모든 테스트 메소드들이 10,000원이 15,000원이 되어도 테스트에 무방하다는 것을 다 검증해봐야만 한다.  
  
테스트를 수정해도 **다른 테스트에 영향을 주어서는 안되게 하는 것**이 좋은 테스트의 기본조건이다.  
각각의 테스트 메소드들 간에 격리돼 실행하는 것과 마찬가지로, 테스트 픽스처 역시 **높은 결합도를 가지면 안된다**.    
  
테스트 클래스 (혹은 `describe`) 에서는 절대 공유 상태를 두면 안된다고 생각하는 것이 오히려 낫다.  

> 여기서의 공유 상태란, 말 그대로 값을 가진 글로벌 변수(함수내 전역 변수, 혹은 인스턴스 변수) 에 해당한다.  

## 2. 해결

그럼 이처럼 자주 사용하게 되는 테스트 픽스처가 있다면 어떻게 하는 것이 좋을까?  
보통 2가지 중 한가지를 선택한다

* 클래스 내부에 private 팩토리 메소드를 만들어서 사용하거나
* 클래스 외부에 static 팩토리 메소드를 만들어서 사용한다

이를 테면 다음과 같이 이 테스트 클래스 (혹은 파일)에서만 사용한다고 하면 private 팩토리 메소드 (`createOrder`) 를 사용한다

```typescript
describe('Order2', () => {

    it('주문취소1', () => {
        const amount = 1000;
        const description = "배민주문";
        const sut = createOrder(amount,  description);

        const cancelOrder: Order = sut.cancel(LocalDateTime.of(2021,10,31,0,0,0));

        expect(cancelOrder.status).toBe(OrderStatus.CANCEL);
        expect(cancelOrder.amount).toBe(-amount);
        expect(cancelOrder.description).toBe(description);
    });

    it('주문취소2', () => {
        const amount = 1000;
        const sut = createOrder(amount);
        expect(sut.cancel(LocalDateTime.of(2021,10,31,0,0,0)).amount).toBe(-amount);
    });
});

function createOrder(amount: number = 1000, description: string = "배민주문") {
    return Order.create(amount, LocalDateTime.of(2021, 10, 30, 10, 0, 0), description);
}
```

* 여기서는 테스트 환경을 의도적으로 구성할 수 있도록 ` createOrder(amount,  description)` 혹은 `createOrder(amount)` 와 같이 테스트에 사용되는 값만 설정한다.
* 테스트에 필요하지 않은 값들은 **기본 값들로 구성한다**

만약 여러 곳에서 사용될 수 있는 픽스처라고 한다면 아래와 같이 아예 별도의 팩토리 클래스로 추출해서 사용하는 것도 좋다. 

```typescript
describe('Order2', () => {

    it('주문취소1', () => {
        const amount = 1000;
        const description = "배민주문";
        const sut = TestOrderFactory.create(amount,  description);

        const cancelOrder: Order = sut.cancel(LocalDateTime.of(2021,10,31,0,0,0));

        expect(cancelOrder.status).toBe(OrderStatus.CANCEL);
        expect(cancelOrder.amount).toBe(-amount);
        expect(cancelOrder.description).toBe(description);
    });

    it('주문취소2', () => {
        const amount = 1000;
        const sut = TestOrderFactory.create(amount);
        expect(sut.cancel(LocalDateTime.of(2021,10,31,0,0,0)).amount).toBe(-amount);
    });
});
```

둘 중 어느 방법을 사용해도 다음의 장점을 얻게 된다.

* 전체 테스트 코드의 양이 줄어들고, 재사용성이 좋다
* 각각의 테스트 메소드의 가독성이 좋아지고, **맥락 파악이 쉬워진다**.
* 각각의 테스트 픽스처가 모두 1회성으로 끝나는 지역변수를 사용하기 때문에 **테스트간 결합도가 낮아진다**

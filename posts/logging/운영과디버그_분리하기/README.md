# 운영 로그와 디버그 로그를 분리하기

> 최근에 [Pete Hodgson](https://blog.thepete.net/about/)가 [martinfowler 블로그에 기재한 글](https://martinfowler.com/articles/domain-oriented-observability.html)을 보면서 **로깅도 하나의 기능**으로 생각하는 것이 좋겠다는 생각하에 이 글을 쓰게 되었다.

시스템을 구축하다보면 다음과 같이 크게 두 종류의 로그를 남긴다.

```ts
logger.error(`API Timeout: ${timeout} seconds`, e);
logger.info(`Ordered Food Product Id: ${product.id}`);

logger.debug(`Total Order Price Amount: ${sum(products.amount)}`);
```
  
이 로그들은 모두 필요한 메세지를 노출시키지만, 실상은 목적이 다르다. 

- Error와 Info 로그는 운영 환경에서 **장애를 디버깅하거나 실행 중인 시스템의 여러 진행 상황, 지표등을 모니터링**하기 위해 추적하기 위한 것이다.
  - error 와 info 로그는 앞으로 운영 로그로 통칭한다.

- Debug 로그는 **프로그래머가 개발 중인 시스템 내부에서 어떤 일이 일어나고 있는지 확인하기 위한 것**으로 프로덕션 환경에서는 실행되지 말아야 한다.

이러한 차이점을 고려할 때 이 **두 가지 유형의 로깅에 서로 다른 방법을 사용하는 것을 고려**해야 한다.  

운영 로그는 시스템에 대한 모니터링, 시스템에 대한 감사로그, 장애 복구 등과 같이 의도한대로 정상 작동하는 것을 검증하는 것이 필요하다.  
즉, 올바르게 작동하는 것을 보장하기 위해 **테스트 코드 역시 작성이 필요하다**.  
또한 목적에 맞게 일관적인 포맷의 메세지로 남겨야 한다.  
Error나 Info 로그를 각양각색의 포맷으로 남긴다면, 모니터링이나 통계 등 이 로그를 남긴 목적을 달성하기 어렵다.  
  
반면에 디버그 로그는 **운영 환경에서의 올바른 작동이 필요하지 않다**.  
오로지 프로그래머가 개발 단계에서 시스템 내부의 작동 방식을 확인하기 위한 용도이므로 **테스트를 거칠 필요가 없으며 운영 로그처럼 메시지가 일관적일 필요도 없다**.  
  
똑같은 로그인데 굳이 이 2개를 구분해서 관리가 필요할까? 라고 생각될 수 있다.  
왜 필요한지 자세히 알아보자.

## 예제

예를 들어 다음과 같은 메소드 구현이 필요하다고 가정해보자.

```ts
export class CartService {
    ...
    removeCart(product: Product) {
        logger.debug("Called RemoveCart");
        
        this.cartRepository.removeProduct(product.id); // 삭제 요청

        if (product.type === ProductType.FOOD && product.isSpoiledFood()) {
            logger.info(`Removed Spoiled Food: ${product.id}, ${product.name}, ${product.price}, Expiration Date=${product.expirationAt}`);
        } else if (product.type === ProductType.BOOK) {
            logger.info(`Removed Book: ${product.id}, ${product.name}, ${product.price}`);
        }
    }
}
```

이 코드에는 크게 3가지 문제가 있다.

1. 주요 로직을 알아보기 힘들정도로 비즈니스 로직을 덮어버린 로깅 코드
2. 로그 작성의 구체적 로직까지도 알아야하는 비즈니스 객체
3. 주요 로깅에 대한 테스트 검증의 어려움

좀 더 자세히 알아보자면 위 코드에서는 **카트 속 상품을 지우는 기능과 더불어서 로깅 인프라가 함께 포함**되어 있다.  
이 코드에서 주요 코드는 다음과 같다.

1) `this.cartRepository.removeProduct(product.id);` 를 호출하는 것
2) 여러 상황에 따른 `logger.info` 호출

반면 주요하지 않는 코드는 다음과 같다.

1) 메소드 호출 여부를 디버깅 하기 위한 `logger.debug("Called RemoveCart");` 

코드를 보면 알겠지만 핵심 로직은 `this.cartRepository.removeProduct(product.id);`  한 줄이며, 나머지 **대부분의 코드는 로그를 남기기 위한 코드**이다.   
  
운영 로그를 로깅 인프라로 바라보고 사용하다보니 주요 로직보다 로깅 코드가 훨씬 더 많은 함수가 되었다.  
  
또한, 일부 언어나 프레임워크에서는 테스트 코드 작성도 어렵다.  
이 에러 (정보) 로깅은 **운영 환경에서 꼭 정상 작동해야하는 기능**이다.  
즉, **테스트 코드로 꼭 검증이 필요한 영역**이다.  
하지만 Java와 같이 Logger를 Static 변수로 사용하는 분야 혹은 그와 유사한 환경에서는 테스트 코드로 검증이 어렵다.  
  
또한 비즈니스 객체와 로깅 인프라가 섞여 있다보니 **에러 (정보) 로깅에 대한 일관된 메세지 포맷을 유지하기 어렵다**.  
  
예를 들어 다음과 같이 비즈니스 객체의 메소드가 계속 추가되었다고 가정해보자.

```ts
export class CartService {
    ...
    removeCart(product: Product) {
        logger.debug(`Called RemoveCart`);

        cartRepository.removeProduct(product.id);
        
        if (product.type === ProductType.FOOD) {
            logger.info(`Removed Cart ${product.id}, ${product.name}, ${product.price}`);
        }
    }

    addCart(product: Product) {
        ....
        cartRepository.addProduct(product.id);

        if (product.type === ProductType.FOOD) {
            logger.info(`[Added Cart] ${product.id}, ${product.name}, ${product.price}`);
        }
    }

    increaseCount(product: Product, count) {
        ...
        cartRepository.increaseCount(product.id, count);

        if (count >= 2) {
            logger.info(`"increase Product Count In Cart" : ${product.id}, ${product.name}, ${product.price}, count=${count}`);
        }
    }
}
```

**비즈니스 로직과 로깅 인프라가 섞여 있다보니** 로깅 인프라의 메세지가 어떤 포맷을 추구하는지 확인하기 위해서는 불필요한 비즈니스 코드가 담긴 메소드들까지 전부 확인을 해야만 한다.  
  
혹은 비슷한 로그 내용이라면 충분히 추상화시킬 수 있지만, 로그라는 특성상 모두가 같은 코드를 계속해서 반복해서 추가하게 된다.

## 해결 방법

이러한 문제들을 해결하기 위해서 **도메인 로깅 인프라를 관리하는 별도의 관측 객체**에 위임하는 것이 좋다.  

```ts
// Business Object
export class CartService {
    
    // 관측 객체 DI
    constructor(cartProbe: CartProbe, cartRepository: CartRepository) {
        this.cartProbe = cartProbe;
        this.cartRepository = cartRepository;
    }

    removeCart(product: Product) {
        logger.debug(`Called RemoveCart`); // 개발자 디버깅용
        this.cartRepository.removeProduct(product.id);
        this.cartProbe.remove(product); // 에러(정보) 로그는 Cart 관측 객체에 위임
    }
}

// Business Probe Object
export class CartProbe {
    remove(product: Product) {
        if (product.type === ProductType.FOOD && product.isSpoiledFood()) {
            logger.info(`Removed Spoiled Food: ${product.id}, ${product.name}, ${product.price}, Expiration Date=${product.expirationAt}`);
        } else if (product.type === ProductType.BOOK) {
            logger.info(`Removed Book: ${product.id}, ${product.name}, ${product.price}`);
        }
    }
}
```

이렇게 관측 객체를 구성해서 위임하게 되면 다음의 장점을 얻게 된다.

1. 비즈니스 로직과 운영 로깅의 단일 책임
2. 테스트 코드 작성의 용이함
3. 일관된 로그 포맷 관리의 용이함
4. 로그 세부 사항에 대한 캡슐화

4번의 경우 각종 로깅에 대해 로거를 사용하는지, 메세지 버스를 사용하는지, 메트릭 트레킹 API를 사용하는지 등등을 비즈니스 로직에서는 알 필요가 없어지는 것을 의미한다.    
  
보통 운영 환경에서 사용되는 로그성 정보는 비즈니스 지표로 사용될 때가 많다.    
처음엔 로그로 쌓은 정보들을 활용하다가 이후에는 각종 메트릭 API를 통해 적재한다.  
그렇게 logger를 다른 전송 수단으로 변경이 필요할때 **비즈니스 객체와 관측 객체를 분리하면 비즈니스 객체들이 이러한 변경에 대해 전혀 신경쓰지 않을 수 있다**.  
  
테스트 코드 역시 작성하기 쉽다.  
관측 객체인 `CartProbe` 를 적절한 Stub 객체로 교체하기는 쉽다.  
혹은 내가 원하는 어떠한 형태의 모의 객체로 변경하는 것이 특수한 테스팅 라이브러리의 도움 없이도 아주 쉽게 가능하다.    

- [메일 내용을 단위 테스트로 상태 검증 하기](https://jojoldu.tistory.com/619)

또한 해당 도메인에 대한 운영 환경의 로깅이 단일 객체에 모여있으니, 어떠한 형태로 로깅을 해야하는지 로그 포맷을 관리하기도 쉬워졌다.  
필요하면 **비슷한 로그 메세지를 모아서 추상화**시킬 수도 있다.  
비즈니스 로직에서 남겨야만 하는 로그가 있고, 해당 로그와 유사한 로그 메소드가 있다면 이를 재사용하면 된다.

## 반론

모든 에러와 정보성 로깅을 캡슐화 하는 것은 오버 엔지니어링이라고 생각할 수 있다.  
  
다만, 조금 더 생각해보면 운영 로그를 관측 객체의 메소드로 관리하는 것은 [생성자 대신에 팩토리 메소드를 만드는 것](https://www.baeldung.com/java-constructors-vs-static-factory-methods)과 유사하다.  
**구현이 아니라 의도 (어떤 목적을 위한 것인지) 에 따라 이 메세지를 작성하는 것인지 의미를 전달할 수 있다**.  
  
우리가 운영 환경에서 작동되는 것이 필수적인 기능들이라면 그 기능들에 대해서는 의도가 명확한 형태로 표현해야한다.  
의도를 표현하기 힘든 생성자 보다는 팩토리 메소드를 사용하는 것처럼 말이다.  
물론 이렇게 관측 객체를 의존성 주입 (DI) 받아 처리하게 되면 POJO와 같은 순수 객체에서는 더이상 직접 로그를 남기기 어렵다.  
  
도메인 객체에서 로그를 진짜 남겨야할 상황이 있을까?  
파일, Console 등으로 외부의 환경에 영향을 주는 로그가 있는 것이 진짜 순수한 객체일까?  
사실은 로그의 위치가 잘못된 것은 아닐지 고민해볼 필요가 있다.  
  
도메인 객체에서는 Exception을 실행하고 서비스 계층 혹은 글로벌 핸들러 등에서 로그를 남기는 것을 고려해보자.

## 디버그 로그

위에서는 계속해서 운영 로그에 대해 이야기를 했다.  
그럼 개발 단계를 위한 디버그 로그는 어떻게 해야할까?  
  
디버그 로그는 그대로 사용하자.  
명백하게 **유지보수의 대상이 아니다**.  
1회성으로 사용되는 코드이며, 테스트 코드로 검증해야할 대상도 아니며, 실행 환경도 다르다.  
이는 관측 객체의 범위가 아니다.
  
오히려 이렇게 운영 로그와 디버그 로그를 구분함으로서 좀 더 역할이 명확해지고 각자의 규칙을 다르게 가져갈 수 있다.  
  
## 마무리

운영 로그와 디버그 로그는 분리하고, 운영 로그는 별도의 관측 객체에 위임하게 되면 얻는 장점이 많다.  

1. 비즈니스 로직과 운영 로깅의 단일 책임
2. 테스트 코드 작성의 용이함
3. 일관된 로그 포맷 관리의 용이함
4. 로그 세부 사항에 대한 캡슐화

운영 로그를 관리하면서 불편함을 계속 느꼈다면 한번 분리해보자.

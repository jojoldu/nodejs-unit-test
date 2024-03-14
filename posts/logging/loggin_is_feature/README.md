# 운영 로깅을 도메인처럼

시스템을 구축하다보면 다음과 같이 크게 두 종류의 로그를 남긴다.

```ts
logger.error(`API Timeout: ${timeout} seconds`, e);
logger.info(`Ordered Food Product Id: ${product.id}`);

logger.debug(`Total Order Price Amount: ${sum(products.amount)}`);
```
  
이 로그들은 모두 필요한 메세지를 노출시키지만, 실상은 목적이 다르다. 

- Error와 Info 로깅은 운영 환경에서 장애를 디버깅하거나 실행 중인 시스템의 진행 상황을 모니터링하기 위해 추적하기 위한 것이다.
  - error 와 info 로그는 앞으로 에러 로그로 통칭한다.

- Debug 로깅은 프로그래머가 개발 중인 시스템 내부에서 어떤 일이 일어나고 있는지 이해하는 데 도움을 주기 위한 것으로 프로덕션 환경에서는 실행되지 말아야 한다.

이러한 차이점을 고려할 때 이 **두 가지 유형의 로깅에 서로 다른 방법을 사용하는 것을 고려**해야 한다.  
  
에러 로그는 시스템에 대한 모니터링, 시스템에 대한 감사로그, 장애 복구 등과 같이 의도한대로 정상 작동하는 것을 검증하는 것이 필요하다.  
즉, 올바르게 작동하는 것을 보장하기 위해 **테스트 코드 역시 작성이 필요하다**.  
또한 목적에 맞게 일관적인 포맷의 메세지로 남겨야 한다.  
Error나 Info 로그를 각양각색의 포맷으로 남긴다면, 모니터링이나 통계 등 이 로그를 남긴 목적을 달성하기 어렵다.  
  
반면에 디버깅 로깅은 **운영 환경에서의 올바른 작동이 필요하지 않다**.  
오로지 프로그래머가 개발 단계에서 시스템 내부의 작동 방식을 확인하기 위한 용도이므로 **테스트를 거칠 필요가 없으며 에러 로그처럼 메시지가 일관적일 필요도 없다**.  
  
똑같은 로그인데 굳이 이 2개를 구분해서 관리가 필요할까? 라는 생각이 든다면,  
**로그를 남기는게 아니라 지표 전송 혹은 알람으로 보내는 기능**으로 생각하면 모든 로그가 동일하게 생각되진 않을 것이다.     
  
예를 들어 다음과 같은 메소드 구현이 필요하다고 가정해보자.

```ts
export class CartService {
    ...
    removeCart(product: Product) {
        logger.debug("Called RemoveCart");
        
        httpClient.removeProduct(product.id); // 삭제 요청

        if (product.type === ProductType.FOOD && product.isSpoiledFood()) {
            logger.info(`Removed Spoiled Food ${product.id}, ${product.name}, ${product.price}, Expiration Date=${product.expirationAt}`);
        } else if (product.type === ProductType.BOOK) {
            logger.info(`Removed Book ${product.id}, ${product.name}, ${product.price}`);
        }
    }
}
```

이 코드에는 크게 3가지 문제가 있다.

1. 비즈니스 로직을 덮어버린 로깅 코드
2. 주요 로깅 영역에 대한 테스트 코드 작성의 어려움
3. 일관된 로그 메세지를 남기는 것에 대한 어려움

좀 더 자세히 알아보자면 위 코드에서는 **카트 속 상품을 지우는 기능과 더불어서 로깅 인프라가 함께 포함**되어 있다.  
이 코드에서 주요 코드는 다음과 같다.

1) `httpClient.removeProduct(product.id);` 를 호출하는 것
2) 여러 상황에 따른 `logger.info` 호출

반면 주요하지 않는 코드는 다음과 같다.

1) 메소드 호출 여부를 디버깅 하기 위한 `logger.debug("Called RemoveCart");` 

코드를 보면 알겠지만 중요한 코드인 `httpClient.removeProduct(product.id);` 외 나머지**대부분의 코드는 로그를 남기기 위한 코드**이다.   

에러 (정보) 로그를 로깅 인프라로 바라보고 사용하다보니 주요 로직보다 로깅 코드가 훨씬 더 많은 함수가 되었다.  
  
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
        
        httpClient.removeProduct(product.id);
        
        if (product.type === ProductType.FOOD) {
            logger.info(`Removed Cart ${product.id}, ${product.name}, ${product.price}`);
        }
    }

    addCart(product: Product) {
        ....
        httpClient.addProduct(product.id);

        if (product.type === ProductType.FOOD) {
            logger.info(`[Added Cart] ${product.id}, ${product.name}, ${product.price}`);
        }
    }

    increaseCount(product: Product, count) {
        ...
        httpClient.increaseCount(product.id, count);

        if (count >= 2) {
            logger.info(`"increase Product Count In Cart" : ${product.id}, ${product.name}, ${product.price}, count=${count}`);
        }
    }
}
```

**비즈니스 로직과 로깅 인프라가 섞여 있다보니** 로깅 인프라의 메세지가 어떤 포맷을 추구하는지 확인하기 위해서는 불필요한 비즈니스 코드가 담긴 메소드들까지 전부 확인을 해야만 한다.  
그래서 결국 해당 비즈니스 객체의 전체 메소드를 다 훑어보면서 로깅 포맷을 맞춰야만 한다.  
  
그래서 이러한 문제들을 해결하기 위해서 **도메인 로깅 인프라를 관리하는 별도의 관측 객체**에 위임하는 것이 좋다.  

```ts
// Business Object
export class CartService {
    
    // 관측 객체 DI
    constructor(cartProbe: CartProbe) {
        this.cartProbe = cartProbe;  
    }

    removeCart(product: Product) {
        logger.debug(`Called RemoveCart`); // 개발자 디버깅용
        httpClient.removeProduct(product.id);
        this.cartProbe.remove(product); // 에러(정보) 로그는 Cart 관측 객체에 위임
    }
}

// Business Probe Object
export class CartProbe {
    remove(product: Product) {
        if (product.type === ProductType.FOOD && product.isSpoiledFood()) {
            logger.info(`Removed Spoiled Food ${product.id}, ${product.name}, ${product.price}, Expiration Date=${product.expirationAt}`);
        } else if (product.type === ProductType.BOOK) {
            logger.info(`Removed Book ${product.id}, ${product.name}, ${product.price}`);
        }
    }
}
```

이렇게 관측 객체를 구성해서 위임하게 되면 다음의 장점을 얻게 된다.

1. 비즈니스 로직과 운영 로깅의 단일 책임
2. 테스트 코드 작성의 용이함
3. 일관된 로그 포맷 관리의 용이함
4. 로그 세부 사항에 대한 캡슐화

4번의 경우 각종 로깅에 대해 로거를 사용하는지, 메세지 버스를 사용하는지, 메트릭 트레킹 API를 사용하는지 등등을 비즈니스 로직에서는 알 필요가 없어진다.  
  
테스트 코드 역시 작성하기 쉽다.  
관측 객체인 `CartProbe` 를 적절한 Stub 객체로 교체하는 등으로 Mocking을 통한 행위 검증에서 명확하게 어떠한 메시지를 출력했는지 상태 검증이 가능하게 된다.

- [메일 내용을 단위 테스트로 상태 검증 하기](https://jojoldu.tistory.com/619)

또한 해당 도메인에 대한 운영 환경의 로깅이 단일 객체에 모여있으니, 어떠한 형태로 로깅을 해야하는지 로그 포맷을 관리하기도 쉬워졌다.  

## 반론

모든 에러와 정보성 로깅을 캡슐화 하는 것은 오버 엔지니어링이라고 생각할 수 있다.  
  
이는 **생성자 대신에 팩토리 메소드를 만드는 것과 유사**하다.  
**구현이 아니라 의도 (어떤 목적을 위한 것인지) 에 따라 코드를 작성하는 것인지 의미를 전달할 수 있다**.    
모든 에러 보고는 알려진 몇 군데에서 처리되므로 보고 방식에 일관성을 유지하고 재사용을 장려하기가 더 쉬워진다.    
  
또한 애플리케이션 계층으로 패키지 (디렉토리)를 바라보는 것이 아닌 애플리케이션 도메인의 관점에서 보고를 구조화하고 제어하는 데 도움이 될 수 있다.  
  
마지막으로, 각 보고서에 대해 테스트를 작성하는 행위는 **애매한 오류 조건을 처리하지 않아 로그가 늘어나고 프로덕션 장애로 이어지는 "이 예외를 어떻게 처리해야 할지 모르겠으니 일단 로그하고 계속 진행하겠다"는 증후군을 방지하는 데 도움이 된다**.

"도메인 개체 전체에 로깅이 있기 때문에 테스트를 위해 로거를 전달할 수 없다."라는 이의 제기가 있었다. 
"모든 곳에 로거를 전달해야 한다."라는 의견이다.  
이것이 디자인을 충분히 명확히 하지 않았다는 것을 알려주는 테스트 냄새라고 생각한다.  
에러 로깅 중 일부는 실제로는 디버깅 로깅이어야 하거나, 동작을 아직 이해하지 못한 상태에서 작성했기 때문에 필요 이상으로 많은 로깅을 하고 있을 수도 있다.  

도메인 코드에 여전히 중복이 너무 많고 대부분의 프로덕션 로깅이 있어야할 진짜 위치를 아직 찾지 못했을 가능성이 크다.

그렇다면 디버깅 로깅은 어떨까?  
작업이 끝나면 철거해야 하는 일회용 장치인가, 아니면 테스트하고 유지 관리해야 하는 필수 인프라인가?  
시스템에 따라 다르지만 일단 구분을 하고 나면 에러 및 디버깅 로깅을 위해 다른 기술을 사용하는 것에 대해 더 자유롭게 생각할 수 있다.    
심지어 인라인 코드는 중요한 프로덕션 코드의 가독성을 방해하기 때문에 디버깅 로깅에 부적합한 기술이라고 판단할 수도 있다.  
대신 몇 가지 측면을 엮을 수 있을지도 모르지만(그것이 표준적인 사용 예시이므로), 그렇지 않을 수도 있지만 적어도 이제 선택의 여지가 명확해졌다.


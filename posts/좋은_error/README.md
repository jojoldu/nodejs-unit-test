# 좋은 예외(Exception) 만들기

예외를 사용하는 것은 피할 수 없다.  
그렇다고 예외를 과도하게 사용하면 오류의 원인을 모호하게 만들 수 있다.  
그래서 종종 예외를 신속하고 단호하게 처리해야 한다고 배운다.  
하지만 반드시 그렇지만은 않다.  
오히려 예외를 우아하게 처리하여 나머지 코드와 조화롭게 만드는 기술을 배워야 한다.

> 이번 글은 Node.js, Java 등에서도 함께 사용할 수 있는 내용들을 고려했다.

## 예외 계층 구조 만들기

예외를 가능한 계층 구조로 만들어서 사용한다.

```ts
class ValidationException extends Error {}

class DuplicatedException extends ValidationException {}

class UserAlreadyRegisteredException extends ValidationException {}

```

## 예외에 의미 제공하기


실패한 코드의 의도를 파악하려면 호출 스택만으로 부족하다.  
그래서 다음의 내용이 예외에 담겨야 한다. 
- 오류 메세지에 어떠한 값을 사용하다가 실패하였는지
- 실패한 작업의 이름과 실패 유형

운영 환경에서 예외가 발생했을 때 조금이라도 정확하고 빠르게 대응 가능해진다.

예외에 해당 예외의 근본 원인을 찾알 수 있는 정확한 정보를 남겨준다.  
예를 들어 사용자의 입력값이 규칙에 어긋난다고 가정해보자.  
  
다음과 같은 형태로 오류를 생성하면 입력값에 대한 오류인것은 알겠지만, **어떻게 입력했길래 검증 로직에서 실패한 것인지 알 수가 없다**.

```ts
// bad
throw new IllegalArgumentException('잘못된 입력입니다.')
```

반면 다음과 같이 오류를 남기면, 

```ts
// good
throw new IllegalArgumentException(`사용자 ${userId}의 입력(${inputData})가 잘못되었다.`)
```

물론 당연하게도 **에러 메세지 그대로 사용자에게 전달하는 곳은 없을 것**이다.  
사용자에게 노출할 메세지와 우리가 해결할 문제의 원인을 남기는 것은 분리해야한다.



## 사용자 메세지와 로깅 메세지 분리하기

로깅 메세지는 가능한 문제 원인을 파악할 수 있는 형태로 가야한다.

## Exception 무시하지 않기

아래와 같이 catch절에서 아무 것도 하지 않는 코드는 바람직하지 않다.

```ts
try {
  process();
} catch (e) {

}
```

정말 할일이 없다면 `//ignore` 로 의도를 주석으로라도 달아주는 것이 차라리 더 낫겠지만, 그럴 경우는 거의 없다.  
  
다만 JVM의 `Connection.close()` 등 워낙 관례적으로 catch절을 무시하는 코드는 주석이 없어도 의도를 파악하는데 어려움이 없다.

## 다시 throw할 거면 try catch로 잡지 않기

아래와 같이 catch절에서 아무 작업도 없이 바로 throw 를 하는 코드는 있나마나한 코드이다.

```ts
function something() {
  try {
    process();
  } catch (e) {
    throw e
  }  
}
```

아래 코드와 그냥 똑같다.
```ts
function something() {
  process();
}
```

Exception을 무시하는것보다는 위험은 적지만, 그래도 굳이 불필요한 코드만 추가한 것이다.  
catch절에는 예외 흐름에 적합한 구현코드가 있어야 한다.  
**로깅 혹은 Layer에 적합한 Exception 변환** 등도 그 예이다.

## 무분별할 Catch 금지

젬이나 라이브러리를 개발할 때 많은 개발자는 기능을 캡슐화하여 라이브러리 외부로 예외가 전파되지 않도록 하려고 한다. 하지만 특정 애플리케이션이 구현될 때까지 예외를 처리하는 방법이 명확하지 않은 경우가 있다.

이상적인 솔루션의 예로 ActiveRecord를 살펴봅시다. 이 라이브러리는 개발자에게 완전성을 위해 두 가지 접근 방식을 제공한다. save 메서드는 예외를 전파하지 않고 단순히 false를 반환하여 예외를 처리하는 반면, save! 메서드는 실패 시 예외를 발생시킵니다. 이를 통해 개발자는 특정 오류 사례를 다르게 처리하거나 일반적인 방식으로 모든 오류를 처리할 수 있다.

하지만 이렇게 완벽한 구현을 제공할 시간이나 리소스가 없다면 어떻게 해야 할까요? 이 경우 불확실성이 있는 경우 예외를 노출하여 야생에 공개하는 것이 가장 좋다.

그 이유는 다음과 같다: 우리는 거의 항상 변화하는 요구 사항을 다루고 있으며, 예외를 항상 특정 방식으로 처리하기로 결정하면 실제로 구현이 손상되어 확장성과 유지 관리성이 저하되고 특히 라이브러리를 개발할 때 막대한 기술 부채가 추가될 수 있다.

앞서 주식 API 소비자가 주가를 조회하는 경우를 예로 들어보겠다. 우리는 불완전하고 잘못된 응답을 그 자리에서 처리하고 유효한 응답을 얻을 때까지 동일한 요청을 다시 시도하기로 결정했다. 그러나 나중에 요구 사항이 변경되어 요청을 다시 시도하는 대신 저장된 과거 주식 데이터로 되돌아가야 할 수도 있다.

이 경우 종속 프로젝트가 이 예외를 처리하지 않기 때문에 라이브러리 자체를 변경하여 이 예외가 처리되는 방식을 업데이트해야 한다. (어떻게 그럴 수 있겠습니까? 이전에는 노출된 적이 없었으니까요.) 또한 라이브러리에 의존하는 프로젝트의 소유자에게도 알려야 한다. 이러한 프로젝트가 많으면 이 오류가 특정 방식으로 처리될 것이라는 가정 하에 빌드되었을 가능성이 높기 때문에 이는 악몽이 될 수 있다.

이제 종속성 관리가 어디로 향하고 있는지 알 수 있다. 전망이 좋지 않다. 이러한 상황은 꽤 자주 발생하며, 라이브러리의 유용성, 확장성 및 유연성을 저하시키는 경우가 많다.

결론은 다음과 같다. 예외를 어떻게 처리해야 할지 불분명하다면 예외를 우아하게 전파하세요. 내부적으로 예외를 처리할 수 있는 명확한 장소가 있는 경우도 많지만, 예외를 노출하는 것이 더 나은 경우도 많이 있다. 따라서 예외 처리를 선택하기 전에 다시 한 번 생각해 보세요. 최종 사용자와 직접 상호작용하는 경우에만 예외 처리를 고집하는 것이 좋다.

## Layer에 맞는 Exception 던지기

Repository (혹은 DAO) 에서 HttpException을 던진다거나 Presentation (Controller) 에서 SQLException을 처리하는것은 Layer별 역할에 맞지 않다.  
적절한 수준으로 추상화된 Exception을 정의하거나 IllegalArgumentException 같은 java의 표준 Exception을 활용할 수도 있다.  
Service layer에서는 Business 로직의 수준에 맞는 custom exception을 정의하는 것도 고려할만 하다.  
이 때 cause exception을 상위 Exception의 생성자에 넘기는 exception chaning기법도 사용할 수 있다.

```ts
try {
  process(url);
} catch (e) {
  throw new BankAccountExeption("fail to call " + url, e);
}
```

## 예외 남용 피하기 

프로그램의 정상적인 흐름을 제어하기 위해 예외를 사용하지 않는다.  
예외는 오직 예외적인 경우에만 사용해야 한다.

## 외부 API의 에러를 Wrapper 클래스로 처리하기

메서드 시그니처에서 Error은 세부 Exception을 가리게 됩니다.

```ts
function updateUser(): Error {

    ....
}

```

정말 다른 Exception을 지정할것이 없을때 최후의 수단으로 씁니다.  
프레임워크에서는 checked exception에 대한 처리를 미루는 목적으로 사용하기도 하지만, Business 코드에서는 습관적으로 java.lang.Exception을 쓴다면 정교한 예외처리를 할 수 없다.


> Java에서는 Unchecked Exception과 Checked Exception 을 문법적으로 구분하고 있지만, 최근엔 **정말 특별한 경우가 아니면 Unchecked Exception을 사용하라**고 권고하고 있다. 
현 시점에서는 unchecked exception을 디폴트로, 특별한 이유가 있는 것만 checked exception을 활용하는 방식이 더 보편적이다.  
> 그리고 TS의 경우 Unchecked Exception만 있으니 JVM 때처럼 Checked Exception을 고민할 필요가 없다.

## logger 사용하기

Exception을 기록으로 남기고 끝낼 경우에라도 로깅 프레임워크를 사용하는 편이 좋다.

```ts
// bad
try {
  process();
} catch (e) {
  console.error("fail to process file", e);
}
```

```ts
// good
try {
  process();
} catch (e) {
  log.error("fail to process file", e);
}
```


JVM의 `e.printStackTrace()`, Node.js의 `console.log | console.error` 등은 콘솔로만 메세지를 남긴다.  
물론 `e.printStackTrace()` 은 Tomcat을 사용할 경우 `{TOMCAT_HOME}/logs/catalina.out` 에 남긴 하지만, 이는 결국 실제 로그 파일로 판단하긴 어렵다.  
  
이와 같이 콘솔 메세지로 관리하는 것에는 크게 2가지 문제가 있다.

- 적절한 로그레벨을 사용할 수 없다.
- 다양한 로그 형태를 사용할 수 없다.



로깅 프레임워크를 이용하면 파일을 쪼개는 정책을 설정할 수 있고, 여러 서버의 로그를 한곳에서 모아서 보는 시스템을 활요할 수도 있다. 

## logger에서는 전체 에러 스택을 남긴다.

로거 메소드에 Exception객체를 직접 넘기면 `e.printStackTrace()` 처럼 Exception의 스택도 모두 남겨준다. 
에러의 추적성을 높이기 위해서는 `e.toString()` 이나 `e.getMessage()` 로 마지막 메시지만 남기기보다는 전체 에러 스택을 다 넘기는 편이 좋다.

## Global Handler 적용

```ts
DB.addDocument(newCustomer, (error: Error, result: Result) => {
  if (error)
    throw new Error('Great error explanation comes here', other useful parameters)
});

try {
  customerService.addNew(req.body).then((result: Result) => {
    res.status(200).json(result);
  }).catch((error: Error) => {
    next(error)
  });
} catch (error) {
  next(error);
}

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  await errorHandler.handleError(err, res);
});

process.on("uncaughtException", (error:Error) => {
  errorHandler.handleError(error);
});

process.on("unhandledRejection", (reason) => {
  errorHandler.handleError(reason);
});
```
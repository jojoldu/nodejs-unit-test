# 좋은 Exception 만들기

Node.js, Java 등에서도 함께 사용할 수 있는 내용들을 고려했다.

## 예외에 의미 제공하기

예외(Exception)에 해당 예외의 근본 원인을 찾알 수 있는 정확한 정보를 남겨준다.  
예를 들어 사용자의 입력값이 규칙에 어긋난다고 가정해보자.  
  
다음과 같은 형태로 오류를 생성하면 입력값에 대한 오류인것은 알겠지만, **어떻게 입력했길래 검증 로직에서 실패한 것인지 알 수가 없다**.

```ts
// bad
throw new IllegalArgumentException('잘못된 입력입니다.')
```

반면 다음과 같이 오류를 남기면, 

```ts
// good
throw new IllegalArgumentException(`사용자 ${userId}의 입력(${inputData})가 잘못되었습니다.`)
```

물론 당연하게도 **에러 메세지 그대로 사용자에게 전달하는 곳은 없을 것**이다.  
사용자에게 노출할 메세지와 우리가 해결할 문제의 원인을 남기는 것은 분리해야한다.


실패한 코드의 의도를 파악하려면 호출 스택만으로 부족하다.  
그래서 다음의 내용이 예외에 담겨야 한다. 
- 오류 메세지에 어떠한 값을 사용하다가 실패하였는지
- 실패한 작업의 이름과 실패 유형

운영 환경에서 예외가 발생했을 때 조금이라도 정확하고 빠르게 대응 가능해진다.


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

## re throw할 거면 try catch로 잡지 않기

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

## 외부 API의 에러를 Wrapper 클래스로 처리하기

메서드 시그니처에서 Error은 세부 Exception을 가리게 됩니다.

```ts
function updateUser(): Error {

    ....
}

```

정말 다른 Exception을 지정할것이 없을때 최후의 수단으로 씁니다.  
프레임워크에서는 checked exception에 대한 처리를 미루는 목적으로 사용하기도 하지만, Business 코드에서는 습관적으로 java.lang.Exception을 쓴다면 정교한 예외처리를 할 수 없습니다.


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
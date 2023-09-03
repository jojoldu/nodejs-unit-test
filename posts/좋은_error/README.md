# 좋은 예외(Exception) 처리 하기

좋은 예외 처리는 견고하고, 좋은 사용자 경험을 줄 수 있다.  
예외 처리를 통해 애플리케이션이 예기치 않게 종료되는 것을 방지하고, 
갑작스런 종료 대신 사용자는 무엇이 잘못되었는지, 그리고 가능하다면 어떻게 바로잡을 수 있는지에 대한 의미 있는 오류 메시지를 받을 수 있다.  
의미 있는 오류 메시지와 로그는 개발자가 문제를 진단하는 데 큰 도움이 되어 이로 인해 문제 해결 시간이 단축된다.  
  
특히, 복잡한 시스템에서 여러 단계의 프로세스가 있는 경우 예외는 프로세스의 위치에 따라 다르게 처리되어 적절한 예외 처리는 이러한 프로그램의 프로세스를 관리하는 데 유연성을 제공한다.  
  
반면, 이를 위해 과도하게 사용하면 메인 비즈니스 로직이 무엇인지 파악하기 힘들 정도로 너무 많은 오류 처리를 가지고 있는 코드가 되기도 한다. 
  
이번 글에서는 좋은 코드를 다루기 위해 필요한 오류 처리 (예외 다루기)를 이야기한다.

> Node.js, Java 등에서도 함께 사용할 수 있는 내용들을 고려했다.
> 예외와 함께 다니는 로그에 대해서도 함께 이야기 하고 싶지만, 이후에 별도로 다룬다.

## 복구 가능한 오류와 불가능한 오류 구분하기

가장 먼저 할 것은 **복구 가능한 오류와 복부 불가능한 오류를 구분**하는 것이다.  
모든 예외에 대해서 동일한 방식을 적용할 수는 없다.  
어떤 예외는 상시로 발생해서 무시할 수 있으며, 어떤 예외는 무시하면 절대 안되는 경우도 있다.  
  
이들을 구분없이 다룬다면 사용자는 불편하고, 개발자는 상시로 발생하는 알람으로 점점 더 시스템의 문제에 등한시 하게 된다.  
  
그래서 이들을 구분해서 **예외가 발생했을때 어떻게 처리할지** 결정해야 한다.  
  

### 복구 가능한 오류

복구 가능한 오류는 일반적으로 **시스템 외적인 요소로 발생하는 치명적이지 않은 오류**이다.  
사용자가 잘못된 전화번호를 입력한다면 이는 시스템을 멈춰야할 정도의 문제가 아니다.  
사용자에게 전화번호가 잘못되었으니 다시 입력하라는 오류 메세지를 제공하고 다시 입력받으면 된다.
마찬가지로 네트워크 오류가 발생했다면 잠시 후, 다시 요청하면 된다.

이러한 오류는 프로그램이 감지하고 적절한 조치를 취한 후 정상적으로 계속 실행될 수 있는 오류이다.

- 사용자의 오입력
- 네트워크 오류 
- 서비스적으로 중요하지 않은 작업의 오류

복구 가능한 오류는 **상시로 발생할 수 있다고 가정하고**, 사용자 (호출자) 에게 가능한 문제 원인을 인지할 수 있게 해야한다.  
  
너무 잦은 복구 가능한 오류의 발생은 복구 불가능한 오류 (개발자의 잘못구현된 코드)일 수 있으니 이를 위해 로그 레벨을 `warn` 으로 두고 임계치를 넘으면 모니터링 알람을 보내도록 구성한다.  
(단, 여기서의 알람 임계치는 복구 불가능한 오류 보다는 기준이 높아야 한다)

### 복구 불가능한 오류

복구 불가능한 오류는 **별도의 조치 없이 시스템이 자동으로 복구할 수 있는 방법이 없는 경우**이다.  
대부분의 경우, 이 오류의 원인을 해결하기 전에 프로그램이 계속 실행될 수 없다.

- 메모리 부족 (Out of Memory)
  - 시스템이 필요한 메모리를 할당받지 못할 때 발생한다. 
- 스택오버플로우 (StackOverflow)
  - 재귀 함수가 너무 깊게 호출되어 스택 메모리가 고갈될 때 발생한다.
- 시스템 레벨의 오류
  - 하드웨어 문제나 운영 체제의 중대한 버그로 인해 발생한다.
- 개발자의 잘못 구현된 코드

복구 불가능한 오류는 빠르게 개발자에게 문제 원인을 알려야한다.  

이를 위해 로그 레벨을 `error`로 두고, 로그에서는 에러 트레이스를 남긴 뒤, 임계치를 초과하면 개발자에게 알람을 보내도록 구성해야한다.

## null, -1, 빈 문자열 등 특수값을 예외로 사용하지 않기

예외 상황은 예외 (Exception) 으로 처리해야 한다.  

일부 프로젝트에서는 **비정상적인 경우에 예외가 아닌 특정 값을 사용**하는 경우가 있다.  
  
예를 들어 아래와 같이 사용자의 입력값이 잘못된 경우 -1을 반환하는 코드를 볼 수 있다.

```ts
// bad
function divideWrong(a: number, b: number): number {
    if (b === 0) {
        return -1;  // 오류를 나타내는 대신 -1 반환
    }
    return a / b;
}
```

이렇게 반환할 경우 호출자는 항상 반환값을 확인해야 한다.
그리고 `-1` 이 의미하는 바가 무엇인지 알아야 한다.
  
반면, 다음과 같이 예외를 반환하는 경우는 호출자가 항상 예외를 처리해야 한다.
그리고 예외의 의미를 알기 위해서는 예외의 타입을 확인하면 된다.

```ts
// good
function divideRight(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Division by zero is not allowed.");  // 오류를 throw
    }
    return a / b;
}
```

이 외에도 특수값을 사용하는 것보다 예외를 사용하는 것의 장점은 다음과 같다.

- 정확히 어떤 문제인지 표현할 수가 있다.
- 해당 문제의 상세 메세지를 포함시킬 수 있다.
- 어떤 경로로 이 문제가 발생한 것인지 확인할 수 있는 Stack Trace를 알 수 있다.
- 더 깔끔한 코드를 작성할 수 있다

## 의미를 담고 있는 예외

예외의 이름이 그 예외의 원인과 내용을 정확하게 반영해야 한다.  
코드를 읽는 사람이 예외 이름만 보고도 해당 예외가 왜 발생했는지 어느 정도 추측할 수 있어야 한다.  
  
이는 크게 2가지 이유가 있다.

- 코드의 가독성 향상: 의미 있는 이름을 가진 예외는 코드를 읽는 사람에게 문맥을 제공한다.
- 디버깅 용이성: 오류의 원인을 빠르게 파악하고 수정할 수 있다.

```ts
// bad
class CustomException extends Error {}

function connectToDatabase() {
    throw new CustomException("Connection failed because of invalid credentials.");
}
```

위 예외는 너무 포괄적인 의미를 담고 있다. (`CustomException`)

```ts
// good
class InvalidCredentialsException extends Error {}

function connectToDatabase() {
    throw new InvalidCredentialsException("Failed to connect due to invalid credentials.");
}
```

이번 코드에서는 `InvalidCredentialsException` 라는 예외 이름을 사용하여 데이터베이스 연결 시 발생하는 인증 오류를 명확하게 나타낸다.  

이 이름만 보고도 해당 예외의 주요 원인을 파악할 수 있다.

## 추적 가능한 예외

실패한 코드의 의도를 파악하려면 호출 스택만으로 부족하다.  
그래서 다음의 내용이 예외에 담겨야 한다. 
- 오류 메세지에 어떠한 값을 사용하다가 실패하였는지
- 실패한 작업의 이름과 실패 유형

운영 환경에서 예외가 발생했을 때 조금이라도 정확하고 빠르게 대응 가능해진다.

예외에 해당 예외의 근본 원인을 찾알 수 있는 정확한 정보를 남겨준다.  
예를 들어 사용자의 입력값이 규칙에 어긋난다고 가정해보자.  
  
다음과 같은 형태로 예외를 생성하면 입력값에 대한 오류인것은 알겠지만, **어떻게 입력했길래 검증 로직에서 실패한 것인지 알 수가 없다**.

```ts
// bad
throw new IllegalArgumentException('잘못된 입력입니다.');
```

반면 다음과 같이 예외를 남기면, 

```ts
// good
throw new IllegalArgumentException(`사용자 ${userId}의 입력(${inputData})가 잘못되었다.`);
```

어떤 이유로 잘못된 것인지 알 수 빠르게 파악할 수 있다.  

## Layer에 맞는 Exception 던지기

Repository (혹은 DAO) 에서 HttpException을 던진다거나 Presentation (Controller) 에서 SQLException을 처리하는것은 Layer별 역할에 맞지 않다.  

여러 계층(layer)로 구성된 소프트웨어 아키텍처에서 각 계층에 맞게 적절한 예외를 정의하고 던지는 방법을 의미한다.  
이러한 방식은 오류를 더 쉽게 추적하고, 각 계층에서 발생하는 오류의 본질에 따라 적절한 처리를 할 수 있도록 한다.

일반적인 3계층 웹 애플리케이션에서는 다음과 같은 계층이 있다.

- 데이터 액세스 계층 (Data Access Layer)
- 비즈니스 로직 계층 (Business Logic Layer)
- 프레젠테이션 계층 (Presentation Layer)

각 계층에서 발생할 수 있는 오류의 성격은 다르기 때문에, 해당 계층에 맞는 예외를 던지는 것이 유용하다.

```ts
// Data Access Layer
class DataAccessException extends Error {}

function fetchUserData(userId: string): any {
    // ...
    throw new DataAccessException("Failed to fetch user data from database.");
}

// Business Logic Layer
class BusinessLogicException extends Error {}

function getUserProfile(userId: string): any {
    try {
        const userData = fetchUserData(userId);
        // ... some business logic
    } catch (error) {
        if (error instanceof DataAccessException) {
            throw new BusinessLogicException("Error processing user profile.");
        }
    }
}

// Presentation Layer
class PresentationException extends Error {}

function displayUserProfile(userId: string): void {
    try {
        const profile = getUserProfile(userId);
        // ... display logic
    } catch (error) {
        if (error instanceof BusinessLogicException) {
            throw new PresentationException("Error displaying user profile.");
        }
    }
}
```
```ts
// 글로벌 Error Handler
try {
    displayUserProfile("someUserId");
} catch (error) {
    if (error instanceof PresentationException) {
        console.error("UI Error:", error.message);
    } else {
        console.error("Unknown error:", error.message);
    }
}

```

위의 예제에서, 각 계층에 대한 오류가 발생하면 해당 계층에 특화된 예외 클래스를 통해 오류를 던진다.  
이렇게 하면, 오류가 발생했을 때 어느 계층에서 문제가 발생했는지 쉽게 파악하고 디버깅할 수 있다.

적절한 수준으로 추상화된 Exception을 정의하거나 `IllegalArgumentException` 같은 java의 표준 Exception을 활용할 수도 있다.  
Service layer에서는 Business 로직의 수준에 맞는 custom exception을 정의하는 것도 고려할만 하다.  
이 때 cause exception을 상위 Exception의 생성자에 넘기는 exception chaning기법도 사용할 수 있다.

```ts
try {
  process(url);
} catch (e) {
  throw new BankAccountExeption("fail to call " + url, e);
}
```

## 예외 계층 구조 만들기

예외를 가능한 계층 구조로 만들어서 사용한다.

```ts
class ValidationException extends Error {}

class DuplicatedException extends ValidationException {}

class UserAlreadyRegisteredException extends ValidationException {}
```  

## 외부의 예외 감싸기

```ts
const pay = new Pay();
try{
    pay.billing();
} catch (pen: PayNetworkError) {
    
} catch (e) {
    
} catch (e) {
    
}
```

## 다시 throw할 거면 잡지 않기

아래와 같이 catch 절에서 아무 작업도 없이 바로 throw 를 하는 코드는 있나마나한 코드이다.

```ts
function something() {
  try {
    // 비즈니스 로직
  } catch (e) {
    throw e
  }  
}
```

아래 코드와 그냥 똑같다.

```ts
function something() {
  // 비즈니스 로직
}
```

Exception을 무시하는것보다는 위험은 적지만, 그래도 굳이 불필요한 코드만 추가한 것이다.  

catch절에는 예외 흐름에 적합한 구현코드가 있어야 한다.  
**로깅 혹은 Layer에 적합한 Exception 변환** 등도 그 예이다.  
로깅 혹은 Layer에 적합한 Exception 변환등이 필요한 것이 아니라면 try catch로 다시 잡지 않는 것이 좋다.

## 정상적인 흐름에서 Catch 금지 (무분별한 Catch 금지)

프로그램의 정상적인 흐름을 제어하기 위해 예외를 사용하지 않는다.  
예외는 오직 예외적인 경우에만 사용해야 한다.

```ts
// bad
function fetchDataFromAPI() {
    // 가상의 API 호출
    if (/* 데이터가 없는 경우 */) {
        throw new NoDataFoundError();
    }
    // 데이터 반환
    return data;
}

function display() {
  try {
    const data = fetchDataFromAPI();
    process(data);
  } catch (error) {
      if (error instanceof NoDataFoundError) {
          displayEmptyState();
      } else {
          displayGenericError();
      }
  }
}

```

위의 예에서 NoDataFoundError 예외는 데이터가 없는 일반적인 상황을 나타내기 위해 사용된다.  
이는 예외를 프로그램의 정상적인 흐름 제어를 위한 수단으로 사용하는 잘못된 접근 방식이다.  
  
반대로 다음과 같이 작성하면,

```ts
// good
function fetchDataFromAPI() {
  // 가상의 API 호출
  if (/* 데이터가 없는 경우 */) {
    return null;
  }
  
  // 데이터 반환
  return data;
}

function display() {
  const data = fetchDataFromAPI();

  if (!data) {
    displayEmptyState();
    return;
  }

  process(data);
}

```

함수는 `null` 을 반환하고 호출자는 그 결과를 확인하여 적절한 액션을 취한다.  
예외는 실제 오류나 예기치 않은 상황을 처리하기 위해서만 사용되어야 한다.

특정 예외를 처리하기 위한 코드를 너무 많이 사용하거나, 필요 이상으로 구체적인 예외를 처리하려고 할 때 발생하는 문제를 지적합니다. 이런 식의 처리는 코드의 가독성을 해칠 수 있으며, 때로는 예외의 실제 원인을 숨기게 될 수 있다.



## 가능한 늦게 예외를 처리 한다.

Exception을 throw 하자마자 잡지 않는다.  
가능하면 해당 예외를 잡아야 하는 단계 중 가장 늦게 잡는다.

```ts
// bad

```

Global Handler 에서 로그를 남긴다.

```ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      message: exception['message'],
      // ... add other fields if needed
    };

    response.status(status).json(errorResponse);
  }
}
```

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

## 마무리

프로그램을 만들면서 오류를 피할 수 없다.  
그래서 좋은 코드는 오류를 어떻게 다루는지가 중요하다. 
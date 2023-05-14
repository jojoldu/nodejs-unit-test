# 좋은 Error 만들기

## 정상
## 예외에 의미 제공하기

실패한 코드의 의도를 파악하려면 호출 스택만으로 부족하다.  
그래서 다음의 내용이 예외에 담겨야 한다. 
- 오류 메세지에 어떠한 값을 사용하다가 실패하였는지
- 실패한 작업의 이름과 실패 유형


## Exception 무시하지 않기

아래와 같이 catch절에서 아무 것도 하지 않는 코드는 바람직하지 않습니다.

```ts
try {
  process();
} catch (e) {

}
```

정말 할일이 없다면 `//ignore` 로 의도를 주석으로라도 달아줍니다.  
다만 Connection.close() 등, 워낙 관례적으로 catch절을 무시하는 코드는 주석이 없어도 의도를 파악하는데 어려움이 없기는합니다.

## 있으나마나한 catch 절 쓰지 않기

아래와 같이 catch절에서 아무 작업도 없이 바로 throw 를 하는 코드는 있나마나한 코드입니다.
```ts
function something() {
  try {
    process();
  } catch (e) {
    throw e
  }  
}
```

아래 코드와 그냥 똑같습니다.
```ts
function something() {
  process();
}
```
Exception을 무시하는것보다는 위험은 적지만, 그래도 굳이 불필요한 코드만 추가한 것입니다. catch절에는 예외 흐름에 적합한 구현코드가 있어야 합니다. 로깅이나 Layer에 적합한 Exception 변환 등도 그 예입니다.

## logger 사용하기

Exception을 기록으로 남기고 끝낼 경우에라도 로깅 프레임워크를 사용하는 편이 좋습니다.

```ts
try {
  process();
} catch (e) {
  console.error("fail to process file", e);
}
```

```ts
try {
  process();
} catch (e) {
  log.error("fail to process file", e);
}
```

Tomcat에서 e.printStackTrace()로 콘솔에 찍힌 값은 {TOMCAT_HOME}/logs/catalina.out 에만 남습니다. 로깅 프레임워크를 이용하면 파일을 쪼개는 정책을 설정할 수 있고, 여러 서버의 로그를 한곳에서 모아서 보는 시스템을 활요할 수도 있습니다.

log.error()메서드에 Exception객체를 직접 넘기는 e.printStackTrace()처럼 Exception의 스택도 모두 남겨줍니다. 에러의 추적성을 높이기 위해서는 e.toString()이나 e.getMessage()로 마지막 메시지만 남기기보다는 전체 에러 스택을 다 넘기는 편이 좋습니다.

## Layer에 맞는 Exception 던지기

DAO에서 ServletException은 던진다거나 Servlet에서 SQLException을 처리하는것은 Layer별 역할에 맞지 않습니다. 적절한 수준으로 추상화된 Exception을 정의하거나 IllegalArgumentException 같은 java의 표준 Exception을 활용할 수도 있습니다. Service layer에서는 Business 로직의 수준에 맞는 custom exception을 정의하는 것도 고려할만 합니다. 이 때 cause exception을 상위 Exception의 생성자에 넘기는 exception chaning기법도 확용할만 합니다.

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


# 좋은 로깅 남기기

## logger 사용하기

Exception을 기록으로 남기고 끝낼 경우에라도 로깅 프레임워크를 사용하는 편이 좋다.

```ts
// bad
try {
  // 비즈니스 로직
} catch (e) {
  console.error("fail to process file", e);
}
```

```ts
// good
try {
  // 비즈니스 로직
} catch (e) {
  logger.error("fail to process file", e);
}
```


JVM의 `e.printStackTrace()`, Node.js의 `console.log | console.error` 등은 콘솔로만 메세지를 남긴다.  
물론 `e.printStackTrace()` 은 Tomcat을 사용할 경우 `{TOMCAT_HOME}/logs/catalina.out` 에 남긴 하지만, 이는 기본적인 로깅 프레임워크들처럼 로그 데이터에 대한 세부적인 설정을 할 수가 없다.  
  
이와 같이 콘솔 메세지로 관리하는 것에는 크게 2가지 문제가 있다.

- 적절한 로그레벨을 사용할 수 없다.
- 다양한 로그 형태를 사용할 수 없다.


로깅 프레임워크를 이용하면 파일을 쪼개는 정책을 설정할 수 있고, 여러 서버의 로그를 한곳에서 모아서 보는 시스템을 활요할 수도 있다. 

## logger에서는 전체 에러 스택을 남긴다.

로거 메소드에 Exception객체를 직접 넘기면 `e.printStackTrace()` 처럼 Exception의 스택도 모두 남겨준다. 
에러의 추적성을 높이기 위해서는 `e.toString()` 이나 `e.getMessage()` 로 마지막 메시지만 남기기보다는 전체 에러 스택을 다 넘기는 편이 좋다.

```ts
// bad
try {
  // 비즈니스 로직
} catch (e) {
  logger.error(`fail to process file: ${e.getMessage()}`);
}
```

```ts
// good
try {
  // 비즈니스 로직
} catch (e) {
  logger.error("fail to process file", e);
}
```
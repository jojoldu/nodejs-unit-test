# unhandledPromiseRejection 처리하기

Process 는 시스템에서 특정 시간에 실행되는 특정 node.js 프로세스의 모든 정보를 추적하고 포함하는 Node.js의 전역 객체이다.

unhandledRejection 이벤트 는 Promise Reject가 처리되지 않을 때마다 발생한다. 
NodeJS는 콘솔에 `UnhandledPromiseRejectionWarning` 에 대해 경고 하고 프로세스를 즉시 종료한다.  
NodeJS 프로세스 글로벌에는 `unhandledRejection` 이벤트가 있다.  
이 이벤트는 unhandledRejection 이 발생하고 Promise Chain에서 이를 처리할 핸들러가 없을 때 발생한다.

일반적으로 최신 Node.js/Express 애플리케이션 코드의 대부분은 .then 핸들러, 함수 콜백 또는 catch 블록 등 프로미스 내에서 실행됩니다. 놀랍게도 개발자가 .catch 절을 추가하는 것을 기억하지 않는 한, 이러한 위치에서 발생하는 오류는 uncaughtException 이벤트 핸들러에 의해 처리되지 않고 사라집니다. 최근 버전의 Node는 처리되지 않은 거부가 발생하면 경고 메시지를 추가했지만, 문제가 발생했을 때 이를 알아차리는 데는 도움이 될 수 있지만 적절한 오류 처리 방법은 아닙니다. 간단한 해결책은 각 프로미스 체인 호출 내에 .catch 절을 추가하고 중앙 집중식 에러 처리기로 리디렉션하는 것을 잊지 않는 것입니다. 그러나 개발자의 규율에만 의존하여 오류 처리 전략을 구축하는 것은 다소 취약합니다. 따라서 로컬에서 처리되지 않는 모든 프로미스 오류를 처리할 수 있도록 process.on('unhandledRejection', callback)을 구독하는 우아한 폴백을 사용하는 것을 적극 권장합니다.

```ts

process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
  // I just caught an unhandled promise rejection,
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
  errorManagement.handler.handleError(error);
  if (!errorManagement.handler.isTrustedError(error))
    process.exit(1);
});
```
# unhandledPromiseRejection 처리하기

Process 는 시스템에서 특정 시간에 실행되는 특정 node.js 프로세스의 모든 정보를 추적하고 포함하는 Node.js의 전역 객체이다.

unhandledRejection 이벤트 는 Promise Reject가 처리되지 않을 때마다 발생한다. 
NodeJS는 콘솔에 `UnhandledPromiseRejectionWarning` 에 대해 경고 하고 프로세스를 즉시 종료한다.  
NodeJS 프로세스 글로벌에는 `unhandledRejection` 이벤트가 있다.  
이 이벤트는 unhandledRejection 이 발생하고 Promise Chain에서 이를 처리할 핸들러가 없을 때 발생한다. 
